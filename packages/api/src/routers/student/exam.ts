import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";
import { z } from "zod";
import { Prisma } from "@workspace/db";

export const examRouter = {
  getForExam: studentProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const exam = await ctx.db.exam.findUnique({
        where: { id: input.id },
        include: {
          mcqs: {
            include: {
              mcq: {
                include: {
                  subject: true,
                  chapter: true,
                },
              },
            },
          },
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      // Check if student has access to this exam
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!student) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student profile not found",
        });
      }

      // Check if exam is within date range
      const now = new Date();
      if (now < exam.startDate || now > exam.endDate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Exam is not available at this time",
        });
      }

      // Get or create exam attempt
      let attempt = await ctx.db.examAttempt.findFirst({
        where: {
          examId: input.id,
          studentId: student.id,
          status: { in: ["Not Started", "In Progress"] },
        },
      });

      const questions = exam.mcqs.map((em) => em.mcq);

      return {
        exam,
        questions: exam.hasSuffle ? shuffleArray(questions) : questions,
        attempt,
      };
    }),

  // Create a new exam attempt
  createAttempt: studentProcedure
    .input(
      z.object({
        examId: z.string(),
        totalQuestions: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exam = await ctx.db.exam.findUnique({
        where: {
          id: input.examId,
        },
        include: {
          attempts: {
            where: {
              studentId: ctx.studentId,
            },
          },
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      // if (exam.attempts.length) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You have already taken this exam",
      //   });
      // }

      // Check for existing attempts
      const existingAttempt = await ctx.db.examAttempt.findFirst({
        where: {
          examId: input.examId,
          studentId: ctx.studentId,
          status: { in: ["In Progress", "Not Started"] },
        },
      });

      if (existingAttempt) {
        // Update to In Progress and set start time
        return ctx.db.examAttempt.update({
          where: { id: existingAttempt.id },
          data: {
            status: "In Progress",
            startTime: new Date(),
            lastActivityAt: new Date(),
          },
        });
      }

      // Create new attempt
      return ctx.db.examAttempt.create({
        data: {
          examId: input.examId,
          studentId: ctx.studentId,
          totalQuestions: input.totalQuestions,
          skippedQuestions: input.totalQuestions,
          hasNegativeMark: exam.hasNegativeMark,
          negativeMark: exam.negativeMark,
          hasShuffle: exam.hasSuffle,
          hasRandom: exam.hasRandom,
          status: "In Progress",
          startTime: new Date(),
          lastActivityAt: new Date(),
          answers: [],
        },
      });
    }),

  // Submit an answer
  submitAnswer: studentProcedure
    .input(
      z.object({
        attemptId: z.string(),
        mcqId: z.string(),
        questionNumber: z.number(),
        selectedOption: z.string(),
        correctAnswer: z.string(),
        timeSpent: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("submitAnswer", input);
      const attempt = await ctx.db.examAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam attempt not found",
        });
      }

      if (attempt.status !== "In Progress") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Exam is not in progress",
        });
      }

      // Check if already answered
      const answers = attempt.answers as any[];
      const alreadyAnswered = answers.some((a: any) => a.mcqId === input.mcqId);

      if (alreadyAnswered) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Question already answered",
        });
      }

      const isCorrect = input.selectedOption === input.correctAnswer;

      // Calculate new metrics
      const newCorrect = isCorrect
        ? attempt.correctAnswers + 1
        : attempt.correctAnswers;
      const newWrong = !isCorrect
        ? attempt.wrongAnswers + 1
        : attempt.wrongAnswers;
      const newAnswered = attempt.answeredCount + 1;
      const newSkipped = attempt.totalQuestions - newAnswered;

      // Calculate streak
      const newStreak = isCorrect ? attempt.currentStreak + 1 : 0;
      const newBestStreak = Math.max(attempt.bestStreak, newStreak);

      // Calculate score with negative marking
      const newScore = attempt.hasNegativeMark
        ? newCorrect - newWrong * attempt.negativeMark
        : newCorrect;

      // Create answer object
      const answerObj = {
        mcqId: input.mcqId,
        selectedOption: input.selectedOption,
        isCorrect,
        answeredAt: new Date().toISOString(),
        timeSpent: input.timeSpent,
      };

      // Update attempt using transaction
      const [updatedAttempt, answerHistory] = await ctx.db.$transaction([
        ctx.db.examAttempt.update({
          where: { id: input.attemptId },
          data: {
            answers: {
              push: answerObj,
            },
            correctAnswers: newCorrect,
            wrongAnswers: newWrong,
            skippedQuestions: newSkipped,
            answeredCount: newAnswered,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            score: newScore,
            lastActivityAt: new Date(),
          },
        }),
        ctx.db.answerHistory.create({
          data: {
            attemptId: input.attemptId,
            mcqId: input.mcqId,
            questionNumber: input.questionNumber,
            selectedOption: input.selectedOption,
            correctAnswer: input.correctAnswer,
            isCorrect,
            timeSpent: input.timeSpent,
            answeredAt: new Date(),
          },
        }),
      ]);

      return {
        attempt: updatedAttempt,
        isCorrect,
        newStreak,
        newBestStreak,
      };
    }),

  // Record tab switch
  recordTabSwitch: studentProcedure
    .input(
      z.object({
        attemptId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.examAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam attempt not found",
        });
      }

      const now = new Date();
      const newTabSwitches = attempt.tabSwitches + 1;

      const warning = {
        type: "tab_switch",
        timestamp: now.toISOString(),
        message: "Student switched tabs",
        count: newTabSwitches,
      };

      // Auto-submit on first tab switch
      if (newTabSwitches === 1) {
        const duration = attempt.startTime
          ? Math.floor((now.getTime() - attempt.startTime.getTime()) / 1000)
          : 0;

        return ctx.db.examAttempt.update({
          where: { id: input.attemptId },
          data: {
            status: "Auto-Submitted",
            submissionType: "Auto-TabSwitch",
            endTime: now,
            duration,
            tabSwitches: newTabSwitches,
            tabSwitchTimes: {
              push: now,
            },
            warnings: {
              push: warning,
            },
          },
        });
      }

      // Just log if already submitted
      return ctx.db.examAttempt.update({
        where: { id: input.attemptId },
        data: {
          tabSwitches: newTabSwitches,
          tabSwitchTimes: {
            push: now,
          },
          warnings: {
            push: warning,
          },
        },
      });
    }),

  // Submit exam
  submitExam: studentProcedure
    .input(
      z.object({
        attemptId: z.string(),
        submissionType: z.enum(["Manual", "Auto-TimeUp", "Auto-TabSwitch"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.examAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam attempt not found",
        });
      }

      if (!["In Progress", "Not Started"].includes(attempt.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Exam is not in progress",
        });
      }

      const now = new Date();
      const duration = attempt.startTime
        ? Math.floor((now.getTime() - attempt.startTime.getTime()) / 1000)
        : 0;

      const status =
        input.submissionType === "Manual" ? "Submitted" : "Auto-Submitted";

      const warning =
        input.submissionType === "Auto-TimeUp"
          ? {
              type: "time_up",
              timestamp: now.toISOString(),
              message: "Time limit reached - exam auto-submitted",
            }
          : undefined;

      return ctx.db.examAttempt.update({
        where: { id: input.attemptId },
        data: {
          status,
          submissionType: input.submissionType,
          endTime: now,
          duration,
          ...(warning && {
            warnings: {
              push: warning,
            },
          }),
        },
      });
    }),

  // Get exam result
  getResult: studentProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const attempt = await ctx.db.examAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          exam: true,
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

      if (attempt.studentId !== student?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      return attempt;
    }),

  // Get student's exam history
  getHistory: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!student) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Student profile not found",
      });
    }

    return ctx.db.examAttempt.findMany({
      where: {
        studentId: student.id,
        status: { in: ["Submitted", "Auto-Submitted"] },
      },
      include: {
        exam: {
          select: {
            title: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
              chapters: {
                select: {
                  chapter: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              students: {
                where: {
                  studentId: ctx.studentId,
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

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}
