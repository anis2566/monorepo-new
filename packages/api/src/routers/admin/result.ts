import z from "zod";

import { type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure } from "../../trpc";

export const resultRouter = {
  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().optional(),
        search: z.string().optional(),
        classNameId: z.string().optional(),
        batchId: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, sort, search, classNameId, batchId, status } = input;

      const [
        results,
        totalCount,
        totalResult,
        activeResult,
        completedResult,
        averageScore,
      ] = await Promise.all([
        ctx.db.examAttempt.findMany({
          where: {
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }),
            ...(classNameId &&
              classNameId !== "All" && {
                exam: {
                  classNames: {
                    some: {
                      classNameId,
                    },
                  },
                },
              }),
            ...(batchId &&
              batchId !== "All" && {
                exam: {
                  batches: {
                    some: {
                      batchId,
                    },
                  },
                },
              }),
            ...(status &&
              status !== "All" && {
                status: {
                  in: [status],
                },
              }),
          },
          include: {
            student: {
              select: {
                name: true,
                studentId: true,
              },
            },
            exam: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.examAttempt.count({
          where: {
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }),
            ...(classNameId &&
              classNameId !== "All" && {
                exam: {
                  classNames: {
                    some: {
                      classNameId,
                    },
                  },
                },
              }),
            ...(batchId &&
              batchId !== "All" && {
                exam: {
                  batches: {
                    some: {
                      batchId,
                    },
                  },
                },
              }),
            ...(status &&
              status !== "All" && {
                status,
              }),
          },
        }),
        ctx.db.examAttempt.count(),
        ctx.db.examAttempt.count({
          where: {
            status: "In Progress",
          },
        }),
        ctx.db.examAttempt.count({
          where: {
            status: "Auto-Submitted",
          },
        }),
        ctx.db.examAttempt.aggregate({
          _count: true,
          _avg: {
            score: true,
          },
        }),
      ]);

      return {
        results,
        totalCount,
        totalResult,
        activeResult,
        completedResult,
        averageScore: averageScore._avg.score,
      };
    }),
} satisfies TRPCRouterRecord;
