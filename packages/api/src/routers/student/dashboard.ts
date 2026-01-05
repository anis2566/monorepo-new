import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const dashboardRouter = {
  get: studentProcedure.query(async ({ ctx }) => {
    const [student, availableExam, completedExam, exams, recentResults] =
      await Promise.all([
        // Student profile
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

        // Available exams count
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

        // Completed exams count
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

        // Upcoming/Ongoing exams
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
            _count: {
              select: {
                mcqs: true,
              },
            },
          },
          orderBy: {
            startDate: "desc",
          },
        }),

        // ✅ NEW: Recent results (last 5)
        ctx.db.examAttempt.findMany({
          where: {
            studentId: ctx.studentId,
            status: { in: ["Submitted", "Auto-Submitted"] },
          },
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                total: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // ✅ Get only last 5 results for dashboard
        }),
      ]);

    // ✅ Transform recent results to match result card format
    const transformedRecentResults = recentResults.map((attempt) => {
      const percentage =
        attempt.totalQuestions > 0
          ? (attempt.score / attempt.totalQuestions) * 100
          : 0;

      const getGrade = (percentage: number) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
      };

      const timeTakenMinutes = attempt.duration
        ? Math.round(attempt.duration / 60)
        : 0;

      return {
        id: attempt.id,
        examId: attempt.examId,
        examTitle: attempt.exam.title,
        score: attempt.score,
        total: attempt.totalQuestions,
        correct: attempt.correctAnswers,
        incorrect: attempt.wrongAnswers,
        skipped: attempt.skippedQuestions,
        percentage,
        grade: getGrade(percentage),
        timeTaken: timeTakenMinutes,
        completedAt: attempt.endTime || attempt.updatedAt,
        status: attempt.status,
        submissionType: attempt.submissionType,
      };
    });

    return {
      exams,
      availableExam,
      completedExam,
      student,
      recentResults: transformedRecentResults, // ✅ Add recent results
    };
  }),
} satisfies TRPCRouterRecord;
