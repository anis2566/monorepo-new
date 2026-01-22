import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { CourseFormSchema } from "@workspace/schema";
import { adminProcedure, publicProcedure } from "../../trpc";
import { z } from "zod";
import { Prisma } from "@workspace/db";

export const courseRouter = {
  createOne: adminProcedure
    .input(CourseFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Parse and validate numeric fields
        const duration = parseInt(input.duration);
        const totalClasses = parseInt(input.totalClasses);
        const price = parseFloat(input.price);
        const originalPrice = input.originalPrice
          ? parseFloat(input.originalPrice)
          : 0;
        const discount = input.discount ? parseFloat(input.discount) : 0;

        if (isNaN(duration) || isNaN(totalClasses)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duration and total classes must be valid numbers",
          });
        }

        if (isNaN(price) || price < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Price must be a valid positive number",
          });
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

        // Create course with all relations in a transaction
        const course = await ctx.db.$transaction(async (tx) => {
          // 1. Create the main course
          const createdCourse = await tx.course.create({
            data: {
              name: input.name,
              type: input.type,
              description: input.description || null,
              duration,
              totalClasses,
              isActive: input.isActive,
              isPopular: input.isPopular || false,
              startDate,
              endDate,
              imageUrl: input.imageUrl || null,
              features: input.features,
              specialBenefits: input.specialBenefits || [],

              // Pricing
              price,
              originalPrice,
              discount,
              pricingLifeCycle: input.pricingLifeCycle || "MONTHLY",

              // Hero section
              heroTitle: input.heroTitle || null,
              heroDescription: input.heroDescription || null,
              tagline: input.tagline || null,
              urgencyMessage: input.urgencyMessage || null,
            },
          });

          // 2. Create course-class associations
          if (input.classIds.length > 0) {
            await tx.courseClass.createMany({
              data: input.classIds.map((classId) => ({
                courseId: createdCourse.id,
                classId,
              })),
            });
          }

          // 3. Create course-subject associations with weight and totalClasses
          if (input.subjectIds.length > 0) {
            const subjectDetails = input.subjectDetails || [];

            for (const subjectId of input.subjectIds) {
              const detail = subjectDetails.find(
                (d) => d.subjectId === subjectId,
              );
              const weight = detail?.weight ? parseInt(detail.weight) : null;
              const subjectTotalClasses = detail?.totalClasses
                ? parseInt(detail.totalClasses)
                : null;

              await tx.courseSubject.create({
                data: {
                  courseId: createdCourse.id,
                  subjectId,
                  weight,
                  totalClasses: subjectTotalClasses,
                },
              });
            }
          }

          // Return created course with all relations
          return tx.course.findUnique({
            where: { id: createdCourse.id },
            include: {
              classes: {
                include: {
                  className: true,
                },
              },
              subjects: {
                include: {
                  subject: true,
                },
              },
            },
          });
        });

        return {
          success: true,
          course,
        };
      } catch (error) {
        // Handle Prisma unique constraint violations
        if (error instanceof Error && "code" in error) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A course with this name already exists",
            });
          }
        }

        // Re-throw TRPCErrors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unexpected errors
        console.error("Error creating course:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course. Please try again.",
        });
      }
    }),

  // Get course for landing page (public)
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

      const course = await ctx.db.course.findFirst({
        where: {
          ...(input.id ? { id: input.id } : {}),
          ...(input.slug ? { name: input.slug } : {}),
          isActive: true,
        },
        include: {
          classes: {
            include: {
              className: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course;
    }),

  // Get all active courses (public)
  getMany: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          type: z.string().optional(),
          isActive: z.string().optional(),
          isPopular: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.CourseWhereInput = {
        ...(input?.search && {
          name: { contains: input.search, mode: "insensitive" },
        }),
        ...(input?.type && { type: input.type }),
        ...(input?.isActive && input.isActive === "true"
          ? { isActive: true }
          : {}),
        ...(input?.isPopular && input.isPopular === "true"
          ? { isPopular: true }
          : {}),
      };

      const [courses, totalCount, totalCourse, activeCourse, popularCourse] =
        await Promise.all([
          ctx.db.course.findMany({
            where,
            include: {
              classes: {
                include: {
                  className: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              subjects: {
                include: {
                  subject: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          }),
          ctx.db.course.count({
            where,
          }),
          ctx.db.course.count(),
          ctx.db.course.count({
            where: {
              isActive: true,
            },
          }),
          ctx.db.course.count({
            where: {
              isPopular: true,
            },
          }),
        ]);

      return {
        courses,
        totalCount,
        totalCourse,
        activeCourse,
        popularCourse,
      };
    }),

  // Get course by ID (admin)
  getOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const course = await ctx.db.course.findUnique({
        where: { id: input.id },
        include: {
          classes: {
            include: {
              className: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      console.log(course);

      return course;
    }),

  // Update course (admin)
  // Update course (admin)
  updateOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: CourseFormSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Parse and validate numeric fields
        const duration = parseInt(input.data.duration);
        const totalClasses = parseInt(input.data.totalClasses);
        const price = parseFloat(input.data.price);
        const originalPrice = input.data.originalPrice
          ? parseFloat(input.data.originalPrice)
          : 0;
        const discount = input.data.discount
          ? parseFloat(input.data.discount)
          : 0;

        if (isNaN(duration) || isNaN(totalClasses)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duration and total classes must be valid numbers",
          });
        }

        if (isNaN(price) || price < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Price must be a valid positive number",
          });
        }

        // Parse dates
        const startDate = input.data.startDate
          ? new Date(input.data.startDate)
          : null;
        const endDate = input.data.endDate
          ? new Date(input.data.endDate)
          : null;

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
        if (!input.data.classIds || input.data.classIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least one class must be selected",
          });
        }

        if (!input.data.subjectIds || input.data.subjectIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least one subject must be selected",
          });
        }

        // Update course with all relations in a transaction
        const course = await ctx.db.$transaction(async (tx) => {
          // 1. Update the main course
          const updatedCourse = await tx.course.update({
            where: { id: input.id },
            data: {
              name: input.data.name,
              type: input.data.type,
              description: input.data.description || null,
              duration,
              totalClasses,
              isActive: input.data.isActive,
              isPopular: input.data.isPopular || false,
              startDate,
              endDate,
              imageUrl: input.data.imageUrl || null,
              features: input.data.features,
              specialBenefits: input.data.specialBenefits || [],

              // Pricing
              price,
              originalPrice,
              discount,
              pricingLifeCycle: input.data.pricingLifeCycle || "MONTHLY",

              // Hero section
              heroTitle: input.data.heroTitle || null,
              heroDescription: input.data.heroDescription || null,
              tagline: input.data.tagline || null,
              urgencyMessage: input.data.urgencyMessage || null,
            },
          });

          // 2. Delete existing course-class associations
          await tx.courseClass.deleteMany({
            where: { courseId: input.id },
          });

          // 3. Create new course-class associations
          if (input.data.classIds.length > 0) {
            await tx.courseClass.createMany({
              data: input.data.classIds.map((classId) => ({
                courseId: updatedCourse.id,
                classId,
              })),
            });
          }

          // 4. Delete existing course-subject associations
          await tx.courseSubject.deleteMany({
            where: { courseId: input.id },
          });

          // 5. Create new course-subject associations with weight and totalClasses
          if (input.data.subjectIds.length > 0) {
            const subjectDetails = input.data.subjectDetails || [];

            for (const subjectId of input.data.subjectIds) {
              const detail = subjectDetails.find(
                (d) => d.subjectId === subjectId,
              );
              const weight = detail?.weight ? parseInt(detail.weight) : null;
              const subjectTotalClasses = detail?.totalClasses
                ? parseInt(detail.totalClasses)
                : null;

              await tx.courseSubject.create({
                data: {
                  courseId: updatedCourse.id,
                  subjectId,
                  weight,
                  totalClasses: subjectTotalClasses,
                },
              });
            }
          }

          // Return updated course with all relations
          return tx.course.findUnique({
            where: { id: updatedCourse.id },
            include: {
              classes: {
                include: {
                  className: true,
                },
              },
              subjects: {
                include: {
                  subject: true,
                },
              },
            },
          });
        });

        return {
          success: true,
          course,
        };
      } catch (error) {
        // Handle Prisma unique constraint violations
        if (error instanceof Error && "code" in error) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A course with this name already exists",
            });
          }
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Course not found",
            });
          }
        }

        // Re-throw TRPCErrors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unexpected errors
        console.error("Error updating course:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update course. Please try again.",
        });
      }
    }),
  // Delete course (admin)
  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCourse = await ctx.db.course.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        course: deletedCourse,
      };
    }),

  // Toggle course active status (admin)
  toggleActive: adminProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCourse = await ctx.db.course.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });

      return {
        success: true,
        course: updatedCourse,
      };
    }),
} satisfies TRPCRouterRecord;
