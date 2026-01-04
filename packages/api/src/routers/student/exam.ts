import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";
import { z } from "zod";
import { Prisma } from "@workspace/db";

export const examRouter = {
  getForExam: studentProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const exam = await ctx.db.exam.findUnique({
        where: {
          id,
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      return exam;
    }),

  getMany: studentProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        status: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { search, status } = input;

      const where: Prisma.ExamWhereInput = {
        students: {
          some: {
            studentId: ctx.studentId,
          },
        },
        ...(search && { title: { contains: search, mode: "insensitive" } }),
        ...(status && status !== "all" && { status }),
      };

      const [totalExam, upcomingExam, activeExam, completedExam, exams] =
        await Promise.all([
          ctx.db.exam.count(),
          ctx.db.exam.count({
            where: {
              status: EXAM_STATUS.Upcoming,
            },
          }),
          ctx.db.exam.count({
            where: {
              status: EXAM_STATUS.Ongoing,
            },
          }),
          ctx.db.exam.count({
            where: {
              status: EXAM_STATUS.Completed,
            },
          }),
          ctx.db.exam.findMany({
            where,
            include: {
              subjects: {
                select: {
                  subject: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              startDate: "desc",
            },
            take: 10,
          }),
        ]);

      return {
        totalExam,
        upcomingExam,
        activeExam,
        completedExam,
        exams,
      };
    }),
} satisfies TRPCRouterRecord;
