import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { z } from "zod";

export const resultRouter = {
  getResult: studentProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!student) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student profile not found",
        });
      }

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

      // Verify student ownership
      if (attempt.studentId !== student.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
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

  // Get all results for a student
  getResults: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!student) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Student profile not found",
      });
    }

    const attempts = await ctx.db.examAttempt.findMany({
      where: {
        studentId: student.id,
        status: { in: ["Submitted", "Auto-Submitted"] },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            total: true,
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return attempts.map((attempt) => {
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
        subjects: attempt.exam.subjects.map((s) => s.subject.name),
        type: attempt.type,
        // ✅ ADD THESE MISSING FIELDS
        hasNegativeMark: attempt.hasNegativeMark,
        negativeMark: attempt.negativeMark,
      };
    });
  }),
} satisfies TRPCRouterRecord;
