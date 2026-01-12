import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure } from "../../trpc";

export const resultRouter = {
  getResult: adminProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.examAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          exam: {
            include: {
              subjects: {
                include: {
                  subject: true,
                },
              },
            },
          },
          answerHistory: {
            include: {
              mcq: {
                include: {
                  subject: true,
                  chapter: true,
                },
              },
            },
            orderBy: {
              questionNumber: "asc",
            },
          },
        },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam attempt not found",
        });
      }

      // Verify attempt is completed
      if (!["Submitted", "Auto-Submitted"].includes(attempt.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Exam is not completed yet",
        });
      }

      // Calculate percentage
      const percentage =
        attempt.totalQuestions > 0
          ? (attempt.score / attempt.totalQuestions) * 100
          : 0;

      // Get grade
      const getGrade = (percentage: number) => {
        if (percentage >= 80) return "A+";
        if (percentage >= 70) return "A";
        if (percentage >= 60) return "A-";
        if (percentage >= 50) return "B+";
        if (percentage >= 40) return "B";
        if (percentage >= 33) return "C";
        return "F";
      };

      // Convert duration from seconds to minutes
      const timeTakenMinutes = attempt.duration
        ? Math.round(attempt.duration / 60)
        : 0;

      // Transform answer history for display
      const reviewQuestions = attempt.answerHistory.map((answer) => ({
        id: answer.id,
        questionNumber: answer.questionNumber,
        mcq: {
          id: answer.mcq.id,
          question: answer.mcq.question,
          options: answer.mcq.options,
          answer: answer.correctAnswer, // The correct option letter
          explanation: answer.mcq.explanation,
          subject: answer.mcq.subject.name,
          chapter: answer.mcq.chapter.name,
          type: answer.mcq.type,
          isMath: answer.mcq.isMath,
          context: answer.mcq.context,
          statements: answer.mcq.statements,
          timeSpent: answer.timeSpent,
        },
        selectedOption: answer.selectedOption,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
      }));

      return {
        attempt: {
          id: attempt.id,
          examId: attempt.examId,
          examTitle: attempt.exam.title,
          status: attempt.status,
          submissionType: attempt.submissionType,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          duration: attempt.duration,
          timeTakenMinutes,
          type: attempt.type,

          // Scores
          score: attempt.score,
          correctAnswers: attempt.correctAnswers,
          wrongAnswers: attempt.wrongAnswers,
          skippedQuestions: attempt.skippedQuestions,
          totalQuestions: attempt.totalQuestions,
          answeredCount: attempt.answeredCount,
          percentage,
          grade: getGrade(percentage),

          // Streaks
          currentStreak: attempt.currentStreak,
          bestStreak: attempt.bestStreak,

          // Settings
          hasNegativeMark: attempt.hasNegativeMark,
          negativeMark: attempt.negativeMark,

          // Metadata
          createdAt: attempt.createdAt,
          updatedAt: attempt.updatedAt,
          completedAt: attempt.endTime || attempt.updatedAt,
        },
        reviewQuestions,
        exam: {
          id: attempt.exam.id,
          title: attempt.exam.title,
          duration: attempt.exam.duration,
          total: attempt.exam.total,
          subjects: attempt.exam.subjects.map((s) => s.subject.name),
        },
      };
    }),

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
