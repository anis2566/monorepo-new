import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure } from "../../trpc";
import { BatchSchema } from "@workspace/schema";
import { Prisma } from "@workspace/db";

const handleError = (error: unknown, operation: string) => {
  console.error(`Error ${operation}:`, error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};

export const batchRouter = {
  createOne: adminProcedure
    .input(BatchSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, classNameId } = input;

      console.log(classNameId);

      try {
        const existingBatch = await ctx.db.batch.findFirst({
          where: { classNameId, name },
          select: { id: true },
        });

        console.log(existingBatch);

        if (existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch already exists",
          });
        }

        await ctx.db.batch.create({
          data: {
            name,
            classNameId,
          },
        });

        return {
          success: true,
          message: "Batch created successfully",
        };
      } catch (error) {
        return handleError(error, "creating batch");
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...BatchSchema.shape,
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, classNameId } = input;

      try {
        // Parallel validation
        const existingBatch = await ctx.db.batch.findUnique({
          where: { id },
        });

        const nameConflict = await ctx.db.batch.findFirst({
          where: {
            classNameId,
            name,
            id: { not: id },
          },
          select: { id: true },
        });

        if (!existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }

        if (nameConflict) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch with this name and class already exists",
          });
        }

        await ctx.db.batch.update({
          where: { id },
          data: {
            name,
            classNameId,
          },
        });

        return { success: true, message: "Batch updated successfully" };
      } catch (error) {
        return handleError(error, "updating batch");
      }
    }),

  deleteOne: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBatch = await ctx.db.batch.findUnique({
          where: { id: input },
        });

        if (!existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }

        await ctx.db.batch.delete({
          where: { id: input },
        });

        return { success: true, message: "Batch deleted successfully" };
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }
        return handleError(error, "deleting batch");
      }
    }),

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const batchData = await ctx.db.batch.findUnique({
      where: { id: input },
    });

    if (!batchData) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Batch not found",
      });
    }

    return batchData;
  }),

  forSelect: adminProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.BatchWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const batches = await ctx.db.batch.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return batches;
    }),

  getByClassNameId: adminProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return [];
      }

      const batchData = await ctx.db.batch.findMany({
        where: { classNameId: input },
      });

      return batchData;
    }),

  getByClassNameIds: adminProcedure
    .input(z.array(z.string()).optional())
    .query(async ({ ctx, input }) => {
      if (!input || !input.length) {
        return [];
      }

      const batchData = await ctx.db.batch.findMany({
        where: {
          classNameId: {
            in: input,
          },
        },
      });

      return batchData;
    }),

  getBatchDetails: adminProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { batchId } = input;

      const batch = await ctx.db.batch.findUnique({
        where: { id: batchId },
        include: {
          className: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!batch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Batch not found",
        });
      }

      return {
        id: batch.id,
        name: batch.name,
        className: batch.className.name,
        classNameId: batch.className.id,
        createdAt: batch.createdAt.toISOString(),
        updatedAt: batch.updatedAt.toISOString(),
      };
    }),

  getBatchStats: adminProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { batchId } = input;

      const [batch, totalStudents, activeExams, completedExams] =
        await Promise.all([
          ctx.db.batch.findUnique({
            where: { id: batchId },
            select: { id: true },
          }),
          ctx.db.student.count({
            where: { batchId },
          }),
          ctx.db.examBatch.count({
            where: {
              batchId,
              exam: {
                status: { in: ["Active", "Ongoing"] },
              },
            },
          }),
          ctx.db.examBatch.count({
            where: {
              batchId,
              exam: {
                status: "Completed",
              },
            },
          }),
        ]);

      if (!batch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Batch not found",
        });
      }

      // Get student performance stats
      const students = await ctx.db.student.findMany({
        where: { batchId },
        include: {
          attempts: {
            where: {
              status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            },
            select: {
              score: true,
              totalQuestions: true,
            },
          },
        },
      });

      const allAttempts = students.flatMap((s) => s.attempts);
      const avgScore =
        allAttempts.length > 0
          ? allAttempts.reduce(
              (sum, a) => sum + (a.score / a.totalQuestions) * 100,
              0
            ) / allAttempts.length
          : 0;

      const totalAttempts = allAttempts.length;
      const passedAttempts = allAttempts.filter(
        (a) => (a.score / a.totalQuestions) * 100 >= 40
      ).length;
      const passRate =
        totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;

      return {
        totalStudents,
        activeExams,
        completedExams,
        totalExams: activeExams + completedExams,
        avgScore: parseFloat(avgScore.toFixed(1)),
        passRate: parseFloat(passRate.toFixed(1)),
        totalAttempts,
      };
    }),

  getBatchStudents: adminProcedure
    .input(
      z.object({
        batchId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { batchId, page, limit } = input;

      const [students, totalCount] = await Promise.all([
        ctx.db.student.findMany({
          where: { batchId },
          include: {
            className: {
              select: {
                name: true,
              },
            },
            attempts: {
              where: {
                status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
              },
              select: {
                score: true,
                totalQuestions: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.db.student.count({ where: { batchId } }),
      ]);

      return {
        students: students.map((student) => {
          const attempts = student.attempts;
          const avgScore =
            attempts.length > 0
              ? attempts.reduce(
                  (sum, a) => sum + (a.score / a.totalQuestions) * 100,
                  0
                ) / attempts.length
              : 0;

          return {
            id: student.id,
            studentId: student.studentId,
            name: student.name,
            imageUrl: student.imageUrl,
            roll: student.roll,
            gender: student.gender,
            className: student.className.name,
            totalAttempts: attempts.length,
            avgScore: parseFloat(avgScore.toFixed(1)),
            createdAt: student.createdAt.toISOString(),
          };
        }),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  getBatchExams: adminProcedure
    .input(
      z.object({
        batchId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { batchId, page, limit } = input;

      const [examBatches, totalCount] = await Promise.all([
        ctx.db.examBatch.findMany({
          where: { batchId },
          include: {
            exam: {
              include: {
                attempts: {
                  where: {
                    status: {
                      in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"],
                    },
                  },
                  select: {
                    score: true,
                    totalQuestions: true,
                  },
                },
              },
            },
          },
          orderBy: { exam: { createdAt: "desc" } },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.db.examBatch.count({ where: { batchId } }),
      ]);

      return {
        exams: examBatches.map((eb) => {
          const exam = eb.exam;
          const attempts = exam.attempts;
          const avgScore =
            attempts.length > 0
              ? attempts.reduce(
                  (sum, a) => sum + (a.score / a.totalQuestions) * 100,
                  0
                ) / attempts.length
              : 0;

          return {
            id: exam.id,
            title: exam.title,
            type: exam.type,
            status: exam.status,
            duration: exam.duration,
            total: exam.total,
            startDate: exam.startDate.toISOString(),
            endDate: exam.endDate.toISOString(),
            totalAttempts: attempts.length,
            avgScore: parseFloat(avgScore.toFixed(1)),
            createdAt: exam.createdAt.toISOString(),
          };
        }),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  getPerformanceData: adminProcedure
    .input(
      z.object({
        batchId: z.string(),
        months: z.number().min(3).max(12).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const { batchId, months } = input;

      const now = new Date();
      const performanceData = [];

      for (let i = months - 1; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const attempts = await ctx.db.examAttempt.findMany({
          where: {
            student: {
              batchId,
            },
            status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            score: true,
            totalQuestions: true,
          },
        });

        const avgScore =
          attempts.length > 0
            ? attempts.reduce(
                (sum, a) => sum + (a.score / a.totalQuestions) * 100,
                0
              ) / attempts.length
            : 0;

        performanceData.push({
          month: startDate.toLocaleString("default", { month: "short" }),
          score: parseFloat(avgScore.toFixed(1)),
          attempts: attempts.length,
        });
      }

      return performanceData;
    }),

  getTopPerformers: adminProcedure
    .input(
      z.object({
        batchId: z.string(),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { batchId, limit } = input;

      const students = await ctx.db.student.findMany({
        where: { batchId },
        include: {
          attempts: {
            where: {
              status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            },
            select: {
              score: true,
              totalQuestions: true,
              bestStreak: true,
            },
          },
        },
      });

      const performersWithStats = students
        .map((student) => {
          const attempts = student.attempts;
          const totalAttempts = attempts.length;

          if (totalAttempts === 0) return null;

          const avgScore =
            attempts.reduce(
              (sum, a) => sum + (a.score / a.totalQuestions) * 100,
              0
            ) / totalAttempts;
          const bestStreak = Math.max(...attempts.map((a) => a.bestStreak), 0);

          return {
            id: student.id,
            studentId: student.studentId,
            name: student.name,
            imageUrl: student.imageUrl,
            avgScore: parseFloat(avgScore.toFixed(1)),
            totalAttempts,
            bestStreak,
          };
        })
        .filter((p) => p !== null)
        .sort((a, b) => b!.avgScore - a!.avgScore)
        .slice(0, limit)
        .map((performer, index) => ({
          ...performer!,
          rank: index + 1,
        }));

      return performersWithStats;
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        classNameId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, classNameId } = input;

      const where: Prisma.BatchWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(classNameId &&
          classNameId !== "All" && { classNameId: { equals: classNameId } }),
      };

      const [batches, totalCount] = await Promise.all([
        ctx.db.batch.findMany({
          where,
          include: {
            className: {
              select: {
                name: true,
              },
            },
            _count: {
              select: { students: true, exams: true },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.batch.count({ where }),
      ]);

      return {
        batches,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
