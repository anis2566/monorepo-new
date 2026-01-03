import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const dashboardRouter = {
  get: studentProcedure.query(async ({ ctx }) => {
    const [student, availableExam, completedExam, exams] = await Promise.all([
      ctx.db.student.findUniqueOrThrow({
        where: {
          id: ctx.studentId,
        },
        include: {
          className: {
            select: {
              name: true,
            },
          },
          batch: {
            select: {
              name: true,
            },
          },
        },
      }),

      ctx.db.exam.count({
        where: {
          status: {
            in: [EXAM_STATUS.Upcoming, EXAM_STATUS.Ongoing],
          },
          students: {
            some: {
              studentId: ctx.studentId,
            },
          },
        },
      }),

      ctx.db.exam.count({
        where: {
          status: {
            in: [EXAM_STATUS.Completed],
          },
          students: {
            some: {
              studentId: ctx.studentId,
            },
          },
        },
      }),

      ctx.db.exam.findMany({
        where: {
          status: {
            in: [EXAM_STATUS.Upcoming, EXAM_STATUS.Ongoing],
          },
          students: {
            some: {
              studentId: ctx.studentId,
            },
          },
        },
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
      }),
    ]);

    return {
      exams,
      availableExam,
      completedExam,
      student,
    };
  }),
} satisfies TRPCRouterRecord;
