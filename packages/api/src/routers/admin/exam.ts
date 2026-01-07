import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure, protectedProcedure } from "../../trpc";
import { ExamSchema } from "@workspace/schema";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const examRouter = {
  createOne: adminProcedure
    .input(ExamSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        title,
        startDate,
        endDate,
        duration,
        cq,
        mcq,
        classNameIds,
        batchIds,
        subjectIds,
        hasSuffle,
        hasRandom,
        hasNegativeMark,
        negativeMark,
        type,
        chapterIds,
      } = input;

      try {
        const numberCq = cq ? parseInt(cq) : 0;
        const numberMcq = mcq ? parseInt(mcq) : 0;
        const total = numberCq + numberMcq;

        const batches = await ctx.db.batch.findMany({
          where: {
            id: {
              in: batchIds,
            },
          },
          include: {
            students: {
              select: {
                id: true,
              },
            },
          },
        });

        if (batches.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Batch not found",
          });
        }

        const students = batches.flatMap((batch) => batch.students);

        const examStatus =
          new Date() < new Date(startDate)
            ? EXAM_STATUS.Upcoming
            : EXAM_STATUS.Ongoing;

        const newExam = await ctx.db.exam.create({
          data: {
            title,
            total,
            cq: numberCq,
            mcq: numberMcq,
            duration: parseInt(duration),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            hasSuffle,
            hasRandom,
            type,
            hasNegativeMark,
            ...(negativeMark && { negativeMark: parseFloat(negativeMark) }),
            status: examStatus,
          },
          select: {
            id: true,
          },
        });

        await ctx.db.$transaction(
          async (tx) => {
            for (const batch of batches) {
              await tx.examBatch.create({
                data: {
                  examId: newExam.id,
                  batchId: batch.id,
                },
              });
            }
            for (const className of classNameIds) {
              await tx.examClassName.create({
                data: {
                  examId: newExam.id,
                  classNameId: className,
                },
              });
            }
            for (const subject of subjectIds) {
              await tx.examSubject.create({
                data: {
                  examId: newExam.id,
                  subjectId: subject,
                },
              });
            }
            for (const student of students) {
              await tx.examStudent.create({
                data: {
                  examId: newExam.id,
                  studentId: student.id,
                },
              });
            }
            for (const chapter of chapterIds || []) {
              await tx.examChapter.create({
                data: {
                  examId: newExam.id,
                  chapterId: chapter,
                },
              });
            }
          },
          {
            timeout: 60000,
            maxWait: 60000,
          }
        );

        return { success: true, message: "Exam created" };
      } catch (error) {
        console.error("Error creating exam:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create exam",
        });
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        data: ExamSchema,
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      try {
        const existingExam = await ctx.db.exam.findFirst({
          where: {
            id,
          },
        });

        if (!existingExam) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exam not found",
          });
        }

        const numberCq = data.cq ? parseInt(data.cq) : 0;
        const numberMcq = data.mcq ? parseInt(data.mcq) : 0;
        const total = numberCq + numberMcq;

        // Fetch all batches with their students
        const batches = await ctx.db.batch.findMany({
          where: {
            id: {
              in: data.batchIds,
            },
          },
          include: {
            students: {
              select: {
                id: true,
              },
            },
          },
        });

        if (batches.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Batch not found",
          });
        }

        const students = batches.flatMap((batch) => batch.students);

        await ctx.db.$transaction(
          async (tx) => {
            // Update the exam
            await tx.exam.update({
              where: {
                id,
              },
              data: {
                title: data.title,
                total,
                cq: numberCq,
                mcq: numberMcq,
                duration: parseInt(data.duration),
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                hasSuffle: data.hasSuffle,
                hasRandom: data.hasRandom,
                hasNegativeMark: data.hasNegativeMark,
                ...(data.negativeMark && {
                  negativeMark: parseFloat(data.negativeMark),
                }),
              },
            });

            // Delete existing relations
            await tx.examBatch.deleteMany({
              where: { examId: id },
            });
            await tx.examClassName.deleteMany({
              where: { examId: id },
            });
            await tx.examSubject.deleteMany({
              where: { examId: id },
            });
            await tx.examStudent.deleteMany({
              where: { examId: id },
            });
            await tx.examChapter.deleteMany({
              where: { examId: id },
            });

            // Create new relations
            for (const batch of batches) {
              await tx.examBatch.create({
                data: {
                  examId: id,
                  batchId: batch.id,
                },
              });
            }
            for (const className of data.classNameIds) {
              await tx.examClassName.create({
                data: {
                  examId: id,
                  classNameId: className,
                },
              });
            }
            for (const subject of data.subjectIds) {
              await tx.examSubject.create({
                data: {
                  examId: id,
                  subjectId: subject,
                },
              });
            }
            for (const student of students) {
              await tx.examStudent.create({
                data: {
                  examId: id,
                  studentId: student.id,
                },
              });
            }
            for (const chapter of data.chapterIds || []) {
              await tx.examChapter.create({
                data: {
                  examId: id,
                  chapterId: chapter,
                },
              });
            }
          },
          {
            timeout: 60000,
            maxWait: 60000,
          }
        );

        return { success: true, message: "Exam updated" };
      } catch (error) {
        console.error("Error updating exam:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update exam",
        });
      }
    }),

  forSelect: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const exams = await ctx.db.exam.findMany({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      return exams;
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const existingExam = await ctx.db.exam.findFirst({
          where: {
            id,
          },
        });

        if (!existingExam) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exam not found",
          });
        }

        await ctx.db.$transaction(async (tx) => {
          // Delete all related records first
          await tx.examBatch.deleteMany({
            where: { examId: id },
          });
          await tx.examClassName.deleteMany({
            where: { examId: id },
          });
          await tx.examSubject.deleteMany({
            where: { examId: id },
          });
          await tx.examStudent.deleteMany({
            where: { examId: id },
          });

          // Delete the exam
          await tx.exam.delete({
            where: {
              id,
            },
          });
        });

        return { success: true, message: "Exam deleted" };
      } catch (error) {
        console.error("Error deleting exam:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete exam",
        });
      }
    }),

  getOne: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const examId = input;

    const examData = await ctx.db.exam.findUnique({
      where: { id: examId },
      include: {
        classNames: {
          select: {
            className: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        batches: {
          select: {
            batch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subjects: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!examData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Exam not found",
      });
    }

    return examData;
  }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100),
        sort: z.string().nullish(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
        classNameId: z.string().nullish(),
        batchId: z.string().nullish(),
        subjectId: z.string().nullish(),
        status: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        sort,
        startDate,
        endDate,
        classNameId,
        batchId,
        subjectId,
        status,
      } = input;

      const targatStartDate = startDate ? new Date(startDate) : new Date();
      const startDateObj = targatStartDate;

      const startDateOfDay = new Date(
        Date.UTC(
          startDateObj.getUTCFullYear(),
          startDateObj.getUTCMonth(),
          startDateObj.getUTCDate(),
          0,
          0,
          0,
          0
        )
      );

      const endDateOfDay = new Date(
        Date.UTC(
          startDateObj.getUTCFullYear(),
          startDateObj.getUTCMonth(),
          startDateObj.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const [exams, totalCount] = await Promise.all([
        ctx.db.exam.findMany({
          where: {
            ...(classNameId && {
              classNames: {
                some: {
                  classNameId,
                },
              },
            }),
            ...(batchId && {
              batches: {
                some: {
                  batchId,
                },
              },
            }),
            ...(subjectId && {
              subjects: {
                some: {
                  subjectId,
                },
              },
            }),
            ...(status && { status }),
          },
          include: {
            classNames: {
              select: {
                className: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            batches: {
              select: {
                batch: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            subjects: {
              select: {
                subject: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                students: true,
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.exam.count({
          where: {
            ...(classNameId && {
              classNames: {
                some: {
                  classNameId,
                },
              },
            }),
            ...(batchId && {
              batches: {
                some: {
                  batchId,
                },
              },
            }),
            ...(subjectId && {
              subjects: {
                some: {
                  subjectId,
                },
              },
            }),
            ...(status && { status }),
          },
        }),
      ]);

      return {
        exams,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
