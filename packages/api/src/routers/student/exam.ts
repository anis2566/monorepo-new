import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";
import { z } from "zod";
import { Prisma } from "@workspace/db";

// ✅ Bangla to English conversion utilities
const BANGLA_TO_ENGLISH_MAP: Record<string, string> = {
  ক: "A",
  খ: "B",
  গ: "C",
  ঘ: "D",
  ঙ: "E",
  চ: "F",
  ছ: "G",
  জ: "H",
  ঝ: "I",
  ঞ: "J",
};

const ENGLISH_TO_BANGLA_MAP: Record<string, string> = {
  A: "ক",
  B: "খ",
  C: "গ",
  D: "ঘ",
  E: "ঙ",
  F: "চ",
  G: "ছ",
  H: "জ",
  I: "ঝ",
  J: "ঞ",
};

/**
 * Convert Bangla option label to English (for database storage)
 */
function banglaToEnglish(label: string): string {
  return BANGLA_TO_ENGLISH_MAP[label] || label;
}

/**
 * Convert English option label to Bangla (for frontend display)
 */
function englishToBangla(label: string): string {
  return ENGLISH_TO_BANGLA_MAP[label.toUpperCase()] || label;
}

/**
 * Normalize option label - handles both Bangla and English
 * Always converts to English for database operations
 */
function normalizeOptionLabel(label: string): string {
  // If it's Bangla, convert to English
  if (BANGLA_TO_ENGLISH_MAP[label]) {
    return BANGLA_TO_ENGLISH_MAP[label];
  }
  // If it's English, uppercase it
  if (/^[A-Z]$/i.test(label)) {
    return label.toUpperCase();
  }
  // Otherwise return as-is (could be text answer)
  return label;
}

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

      if (exam.attempts.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Exam is already attempted",
        });
      }

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

      // ✅ CREATE NEW ATTEMPT WITH NEGATIVE MARKING SNAPSHOT
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
          type: exam.type,
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

      // ✅ NORMALIZE LABELS: Convert Bangla to English for comparison
      const normalizedSelected = normalizeOptionLabel(input.selectedOption);
      const normalizedCorrect = normalizeOptionLabel(input.correctAnswer);

      console.log("Answer Comparison:", {
        selectedRaw: input.selectedOption,
        selectedNormalized: normalizedSelected,
        correctRaw: input.correctAnswer,
        correctNormalized: normalizedCorrect,
      });

      const isCorrect = normalizedSelected === normalizedCorrect;

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

      // ✅ CALCULATE SCORE WITH NEGATIVE MARKING
      let newScore: number;

      if (attempt.hasNegativeMark) {
        const penalty = newWrong * attempt.negativeMark;
        newScore = newCorrect - penalty;
        newScore = Math.max(0, newScore);
        newScore = Math.round(newScore);
      } else {
        newScore = newCorrect;
      }

      // ✅ Store normalized (English) labels in database
      const answerObj = {
        mcqId: input.mcqId,
        selectedOption: normalizedSelected, // Store as English
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
            selectedOption: normalizedSelected, // Store as English
            correctAnswer: normalizedCorrect, // Store as English
            isCorrect,
            timeSpent: input.timeSpent,
            answeredAt: new Date(),
          },
        }),
      ]);

      console.log("Is correct", isCorrect);

      return {
        attempt: updatedAttempt,
        isCorrect,
        newStreak,
        newBestStreak,
        score: newScore,
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

        let finalScore: number;

        if (attempt.hasNegativeMark) {
          const penalty = attempt.wrongAnswers * attempt.negativeMark;
          finalScore = attempt.correctAnswers - penalty;
          finalScore = Math.max(0, finalScore);
          finalScore = Math.round(finalScore);
        } else {
          finalScore = attempt.correctAnswers;
        }

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
            score: finalScore,
          },
        });
      }

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

      let finalScore: number;

      if (attempt.hasNegativeMark) {
        const penalty = attempt.wrongAnswers * attempt.negativeMark;
        finalScore = attempt.correctAnswers - penalty;
        finalScore = Math.max(0, finalScore);
        finalScore = Math.round(finalScore);
      } else {
        finalScore = attempt.correctAnswers;
      }

      return ctx.db.examAttempt.update({
        where: { id: input.attemptId },
        data: {
          status,
          submissionType: input.submissionType,
          endTime: now,
          duration,
          score: finalScore,
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
