import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { ProgramFormSchema } from "@workspace/schema";
import { adminProcedure, publicProcedure } from "../../trpc";
import { z } from "zod";
import { ProgramType } from "@workspace/db";

export const programRouter = {
  createOne: adminProcedure
    .input(ProgramFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Parse and validate numeric fields
        const duration = parseInt(input.duration);
        const totalClasses = parseInt(input.totalClasses);

        if (isNaN(duration) || isNaN(totalClasses)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duration and total classes must be valid numbers",
          });
        }

        // Parse Medical Admission specific fields
        let negativeMarks = null;
        let examDuration = null;
        let totalMarks = null;
        let totalQuestions = null;

        if (input.type === "MEDICAL_ADMISSION" && input.hasNegativeMarking) {
          if (input.negativeMarks) {
            negativeMarks = parseFloat(input.negativeMarks);
            if (isNaN(negativeMarks)) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Negative marks must be a valid number",
              });
            }
          }

          if (input.examDuration) {
            examDuration = parseInt(input.examDuration);
          }
          if (input.totalMarks) {
            totalMarks = parseInt(input.totalMarks);
          }
          if (input.totalQuestions) {
            totalQuestions = parseInt(input.totalQuestions);
          }
        }

        // Parse dates
        const startDate = input.startDate ? new Date(input.startDate) : null;
        const endDate = input.endDate ? new Date(input.endDate) : null;

        if (startDate && isNaN(startDate.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid start date",
          });
        }

        if (endDate && isNaN(endDate.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid end date",
          });
        }

        if (startDate && endDate && endDate <= startDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "End date must be after start date",
          });
        }

        // Validate required fields
        if (!input.packages || input.packages.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least one package is required",
          });
        }

        if (!input.classIds || input.classIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least one class must be selected",
          });
        }

        if (!input.subjectIds || input.subjectIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least one subject must be selected",
          });
        }

        // Create program with all relations in a transaction
        const program = await ctx.db.$transaction(async (tx) => {
          // 1. Create the main program
          const createdProgram = await tx.program.create({
            data: {
              name: input.name,
              type: input.type as ProgramType,
              description: input.description || null,
              duration,
              totalClasses,
              isActive: input.isActive,
              isPopular: input.isPopular || false,
              startDate,
              endDate,
              imageUrl: input.imageUrl || null,
              features: input.features,

              // Hero section
              heroTitle: input.heroTitle || null,
              heroDescription: input.heroDescription || null,
              tagline: input.tagline || null,
              urgencyMessage: input.urgencyMessage || null,

              // Medical Admission specific
              hasNegativeMarking: input.hasNegativeMarking || false,
              negativeMarks,
              examDuration,
              totalMarks,
              totalQuestions,
            },
          });

          // 2. Create program-class associations
          if (input.classIds.length > 0) {
            await tx.programClass.createMany({
              data: input.classIds.map((classId) => ({
                programId: createdProgram.id,
                classId,
              })),
            });
          }

          // 3. Create program-batch associations
          if (input.batchIds.length > 0) {
            // Check if batchDetails are provided
            if (input.batchDetails && input.batchDetails.length > 0) {
              for (const batchDetail of input.batchDetails) {
                const seatsTotal = batchDetail.seatsTotal
                  ? parseInt(batchDetail.seatsTotal)
                  : null;
                const seatsRemaining = batchDetail.seatsRemaining
                  ? parseInt(batchDetail.seatsRemaining)
                  : null;

                await tx.programBatch.create({
                  data: {
                    programId: createdProgram.id,
                    batchId: batchDetail.batchId,
                    displayName: batchDetail.displayName || null,
                    seatsTotal,
                    seatsRemaining,
                    startDate: batchDetail.startDate || null,
                  },
                });
              }
            } else {
              // Create without additional details
              await tx.programBatch.createMany({
                data: input.batchIds.map((batchId) => ({
                  programId: createdProgram.id,
                  batchId,
                })),
              });
            }
          }

          // 4. Create program-subject associations
          if (input.subjectIds.length > 0) {
            await tx.programSubject.createMany({
              data: input.subjectIds.map((subjectId) => ({
                programId: createdProgram.id,
                subjectId,
              })),
            });
          }

          // 5. Create packages
          for (const pkg of input.packages) {
            const price = parseFloat(pkg.price);
            const originalPrice = pkg.originalPrice
              ? parseFloat(pkg.originalPrice)
              : null;
            const discount = pkg.discount ? parseInt(pkg.discount) : null;

            // Validate package prices
            if (isNaN(price) || price < 0) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Invalid price for package: ${pkg.name}`,
              });
            }

            if (
              originalPrice !== null &&
              (isNaN(originalPrice) || originalPrice < price)
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Original price must be greater than or equal to price for package: ${pkg.name}`,
              });
            }

            if (
              discount !== null &&
              (isNaN(discount) || discount < 0 || discount > 100)
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Discount must be between 0 and 100 for package: ${pkg.name}`,
              });
            }

            await tx.package.create({
              data: {
                programId: createdProgram.id,
                name: pkg.name,
                description: pkg.description || null,
                price,
                originalPrice,
                discount,
                features: pkg.features,
                isActive: pkg.isActive,
                isRecommended: pkg.isRecommended || false,
                displayBadge: pkg.displayBadge || null,
                headerColor: pkg.headerColor || null,
                badgeColor: pkg.badgeColor || null,
                headerTextColor: pkg.headerTextColor || null,
              },
            });
          }

          // 6. Create syllabus if provided
          if (input.syllabus && input.syllabus.length > 0) {
            for (const [index, syllabusItem] of input.syllabus.entries()) {
              const subjectWeight = syllabusItem.subjectWeight
                ? parseInt(syllabusItem.subjectWeight)
                : null;

              const createdSyllabus = await tx.programSyllabus.create({
                data: {
                  programId: createdProgram.id,
                  subjectId: syllabusItem.subjectId,
                  orderIndex: index,
                  subjectWeight,
                },
              });

              if (syllabusItem.chapters && syllabusItem.chapters.length > 0) {
                for (const [
                  chapterIndex,
                  chapter,
                ] of syllabusItem.chapters.entries()) {
                  const marks = chapter.marks ? parseInt(chapter.marks) : null;

                  await tx.programChapter.create({
                    data: {
                      syllabusId: createdSyllabus.id,
                      name: chapter.name,
                      topics: chapter.topics || null,
                      orderIndex: chapterIndex,
                      marks,
                      priority: chapter.priority || null,
                    },
                  });
                }
              }
            }
          }

          // 7. Create schedule if provided
          if (input.schedule && input.schedule.length > 0) {
            await tx.programSchedule.createMany({
              data: input.schedule.map((item, index) => ({
                programId: createdProgram.id,
                day: item.day,
                time: item.time,
                subject: item.subject,
                type: item.type,
                orderIndex: index,
              })),
            });
          }

          // 8. Create mock test plan if provided (Medical Admission)
          if (input.mockTestPlan && input.mockTestPlan.length > 0) {
            for (const [index, mockTest] of input.mockTestPlan.entries()) {
              const testsCount = parseInt(mockTest.testsCount);

              await tx.mockTestPlan.create({
                data: {
                  programId: createdProgram.id,
                  weekRange: mockTest.weekRange,
                  focus: mockTest.focus,
                  testsCount,
                  testType: mockTest.testType,
                  orderIndex: index,
                },
              });
            }
          }

          // 9. Create exam strategies if provided (Medical Admission)
          if (input.examStrategies && input.examStrategies.length > 0) {
            await tx.examStrategy.createMany({
              data: input.examStrategies.map((strategy, index) => ({
                programId: createdProgram.id,
                title: strategy.title,
                description: strategy.description,
                iconName: strategy.iconName,
                orderIndex: index,
              })),
            });
          }

          // 10. Create medical topics if provided (HSC Academic)
          if (input.medicalTopics && input.medicalTopics.length > 0) {
            await tx.medicalTopic.createMany({
              data: input.medicalTopics.map((topic, index) => ({
                programId: createdProgram.id,
                title: topic.title,
                description: topic.description,
                iconName: topic.iconName,
                orderIndex: index,
              })),
            });
          }

          // 11. Create special benefits if provided
          if (input.specialBenefits && input.specialBenefits.length > 0) {
            await tx.specialBenefit.createMany({
              data: input.specialBenefits.map((benefit, index) => ({
                programId: createdProgram.id,
                title: benefit,
                orderIndex: index,
              })),
            });
          }

          // 12. Create FAQs if provided
          if (input.faqs && input.faqs.length > 0) {
            await tx.programFAQ.createMany({
              data: input.faqs.map((faq, index) => ({
                programId: createdProgram.id,
                question: faq.question,
                answer: faq.answer,
                orderIndex: index,
              })),
            });
          }
        });

        return {
          success: true,
          message: "Program created successfully",
        };
      } catch (error) {
        // Handle Prisma unique constraint violations
        if (error instanceof Error && "code" in error) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A program with this name already exists",
            });
          }
        }

        // Re-throw TRPCErrors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unexpected errors
        console.error("Error creating program:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create program. Please try again.",
        });
      }
    }),

  // Get program for landing page (public)
  getForLandingPage: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either id or slug is required",
        });
      }

      const program = await ctx.db.program.findFirst({
        where: {
          ...(input.id ? { id: input.id } : {}),
          ...(input.slug ? { name: input.slug } : {}),
          isActive: true,
        },
        include: {
          batches: {
            include: {
              batch: {
                include: {
                  className: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          packages: {
            where: { isActive: true },
            orderBy: { isRecommended: "desc" },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
          syllabus: {
            include: {
              subject: true,
              chapters: {
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
          schedule: {
            orderBy: { orderIndex: "asc" },
          },
          mockTestPlan: {
            orderBy: { orderIndex: "asc" },
          },
          examStrategies: {
            orderBy: { orderIndex: "asc" },
          },
          medicalTopics: {
            orderBy: { orderIndex: "asc" },
          },
          specialBenefits: {
            orderBy: { orderIndex: "asc" },
          },
          faqs: {
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found",
        });
      }

      return program;
    }),

  // Get all active programs (public)
  getAll: publicProcedure
    .input(
      z
        .object({
          type: z
            .enum(["SSC_FOUNDATION", "HSC_ACADEMIC", "MEDICAL_ADMISSION"])
            .optional(),
          isPopular: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const programs = await ctx.db.program.findMany({
        where: {
          isActive: true,
          ...(input?.type ? { type: input.type } : {}),
          ...(input?.isPopular !== undefined
            ? { isPopular: input.isPopular }
            : {}),
        },
        include: {
          packages: {
            where: { isActive: true },
            orderBy: { isRecommended: "desc" },
            take: 1, // Get the recommended or first package for preview
          },
          subjects: {
            include: {
              subject: true,
            },
            take: 3, // Preview subjects
          },
          _count: {
            select: {
              batches: true,
              classes: true,
            },
          },
        },
        orderBy: [{ isPopular: "desc" }, { createdAt: "desc" }],
      });

      return programs;
    }),

  // Get program by ID (admin)
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: { id: input.id },
        include: {
          batches: {
            include: {
              batch: {
                include: {
                  className: true,
                },
              },
            },
          },
          packages: true,
          subjects: {
            include: {
              subject: true,
            },
          },
          classes: {
            include: {
              className: true,
            },
          },
          syllabus: {
            include: {
              subject: true,
              chapters: {
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
          schedule: {
            orderBy: { orderIndex: "asc" },
          },
          mockTestPlan: {
            orderBy: { orderIndex: "asc" },
          },
          examStrategies: {
            orderBy: { orderIndex: "asc" },
          },
          medicalTopics: {
            orderBy: { orderIndex: "asc" },
          },
          specialBenefits: {
            orderBy: { orderIndex: "asc" },
          },
          faqs: {
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found",
        });
      }

      return program;
    }),

  // Delete program (admin)
  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedProgram = await ctx.db.program.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        program: deletedProgram,
      };
    }),
} satisfies TRPCRouterRecord;
