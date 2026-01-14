import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { Prisma } from "@workspace/db";
import { generateOTP, sendSMS } from "../sms";

// ✅ Bangla to English conversion utilities (reused from student exam)
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

function normalizeOptionLabel(label: string): string {
  if (BANGLA_TO_ENGLISH_MAP[label]) {
    return BANGLA_TO_ENGLISH_MAP[label];
  }
  if (/^[A-Z]$/i.test(label)) {
    return label.toUpperCase();
  }
  return label;
}

export const publicExamRouter = {
  // Get public exam details (no auth required)
  getPublicExam: publicProcedure
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

      if (!exam.isPublic) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This exam is not available for public access",
        });
      }

      // Check if exam is within date range
      // const now = new Date();
      // if (now < exam.startDate || now > exam.endDate) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "Exam is not available at this time",
      //   });
      // }

      const questions = exam.mcqs.map((em) => em.mcq);

      return {
        exam: {
          id: exam.id,
          title: exam.title,
          total: exam.total,
          duration: exam.duration,
          startDate: exam.startDate,
          endDate: exam.endDate,
          hasNegativeMark: exam.hasNegativeMark,
          negativeMark: exam.negativeMark,
          type: exam.type,
          totalQuestions: questions.length,
          hasShuffle: exam.hasSuffle, // Note: typo in schema
        },
        questions: exam.hasSuffle ? shuffleArray(questions) : questions,
      };
    }),

  // Send OTP for public exam registration
  sendPublicOtp: publicProcedure
    .input(
      z.object({
        phone: z.string().regex(/^01[0-9]{9}$/, "Invalid phone number"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const otp = generateOTP();
      const identifier = `public:${input.phone}`;

      // Delete existing verification if any
      await ctx.db.smsVerification.deleteMany({
        where: { identifier },
      });

      await ctx.db.smsVerification.create({
        data: {
          identifier,
          value: otp,
          expiresAt: new Date(Date.now() + 60 * 5 * 1000), // 5 minutes
        },
      });

      await sendSMS(
        input.phone,
        `Your Mr. Dr. public exam verification code is ${otp}`
      );

      return { success: true };
    }),

  // Get public attempt details
  getPublicAttempt: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.publicExamAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          participant: {
            select: {
              id: true,
              name: true,
              phone: true,
              isVerified: true,
            },
          },
        },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attempt not found",
        });
      }

      return attempt;
    }),

  // Verify phone number for public participant
  verifyPublicPhone: publicProcedure
    .input(
      z.object({
        phone: z.string().regex(/^01[0-9]{9}$/, "Invalid phone number"),
        code: z.string().length(6, "Invalid code"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const identifier = `public:${input.phone}`;
      const verification = await ctx.db.smsVerification.findFirst({
        where: {
          identifier,
          value: input.code,
          expiresAt: { gt: new Date() },
        },
      });

      if (!verification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification code",
        });
      }

      // Check if participant exists
      const participant = await ctx.db.publicExamParticipant.findFirst({
        where: { phone: input.phone },
      });

      if (participant) {
        await ctx.db.publicExamParticipant.update({
          where: { id: participant.id },
          data: { isVerified: true },
        });
      }

      await ctx.db.smsVerification.delete({
        where: { id: verification.id },
      });

      return { success: true };
    }),

  // Register participant and create attempt
  registerParticipant: publicProcedure
    .input(
      z.object({
        examId: z.string(),
        name: z.string().min(2, "Name must be at least 2 characters"),
        class: z.string().min(1, "Class is required"),
        phone: z.string().regex(/^01[0-9]{9}$/, "Invalid phone number format"),
        college: z.string().min(2, "College name is required"),
        email: z.string().email().optional().or(z.literal("")),
        isVerified: z.boolean().optional().default(false),
        otpCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If otpCode is provided, verify it first
      let isActuallyVerified = input.isVerified;
      if (input.otpCode) {
        const identifier = `public:${input.phone}`;
        const verification = await ctx.db.smsVerification.findFirst({
          where: {
            identifier,
            value: input.otpCode,
            expiresAt: { gt: new Date() },
          },
        });

        if (!verification) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired verification code",
          });
        }
        isActuallyVerified = true;

        // Cleanup verification
        await ctx.db.smsVerification.delete({
          where: { id: verification.id },
        });
      }

      const exam = await ctx.db.exam.findUnique({
        where: { id: input.examId },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      if (!exam.isPublic) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This exam is not available for public access",
        });
      }

      // Check if participant already exists with this phone
      let participant = await ctx.db.publicExamParticipant.findFirst({
        where: { phone: input.phone },
      });

      if (!participant) {
        // Create new participant
        participant = await ctx.db.publicExamParticipant.create({
          data: {
            name: input.name,
            class: input.class,
            phone: input.phone,
            college: input.college,
            email: input.email || null,
            isVerified: isActuallyVerified,
          },
        });
      } else if (isActuallyVerified) {
        // Update verification status if verified during registration
        participant = await ctx.db.publicExamParticipant.update({
          where: { id: participant.id },
          data: {
            name: input.name,
            class: input.class,
            college: input.college,
            email: input.email || null,
            isVerified: true,
          },
        });
      }

      // Check if participant already has an attempt for this exam
      const existingAttempt = await ctx.db.publicExamAttempt.findFirst({
        where: {
          examId: input.examId,
          participantId: participant.id,
        },
      });

      if (existingAttempt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already attempted this exam",
        });
      }

      // Get total questions
      const totalQuestions = await ctx.db.examMcq.count({
        where: { examId: input.examId },
      });

      // Create exam attempt
      const attempt = await ctx.db.publicExamAttempt.create({
        data: {
          examId: input.examId,
          participantId: participant.id,
          totalQuestions,
          skippedQuestions: totalQuestions,
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

      return {
        attemptId: attempt.id,
        participantId: participant.id,
      };
    }),

  // Submit an answer
  submitPublicAnswer: publicProcedure
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
      const attempt = await ctx.db.publicExamAttempt.findUnique({
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

      // Normalize labels
      const normalizedSelected = normalizeOptionLabel(input.selectedOption);
      const normalizedCorrect = normalizeOptionLabel(input.correctAnswer);

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

      // Calculate score with negative marking
      let newScore: number;

      if (attempt.hasNegativeMark) {
        const penalty = newWrong * attempt.negativeMark;
        newScore = newCorrect - penalty;
        newScore = Math.max(0, newScore);
      } else {
        newScore = newCorrect;
      }

      const answerObj = {
        mcqId: input.mcqId,
        selectedOption: normalizedSelected,
        isCorrect,
        answeredAt: new Date().toISOString(),
        timeSpent: input.timeSpent,
      };

      // Update attempt using transaction
      const [updatedAttempt, answerHistory] = await ctx.db.$transaction([
        ctx.db.publicExamAttempt.update({
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
        ctx.db.publicAnswerHistory.create({
          data: {
            attemptId: input.attemptId,
            mcqId: input.mcqId,
            questionNumber: input.questionNumber,
            selectedOption: normalizedSelected,
            correctAnswer: normalizedCorrect,
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
        score: newScore,
      };
    }),

  // Record tab switch
  recordPublicTabSwitch: publicProcedure
    .input(
      z.object({
        attemptId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.publicExamAttempt.findUnique({
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
        message: "Participant switched tabs",
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
        } else {
          finalScore = attempt.correctAnswers;
        }

        return ctx.db.publicExamAttempt.update({
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

      return ctx.db.publicExamAttempt.update({
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
  submitPublicExam: publicProcedure
    .input(
      z.object({
        attemptId: z.string(),
        submissionType: z.enum(["Manual", "Auto-TimeUp", "Auto-TabSwitch"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.publicExamAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam attempt not found",
        });
      }

      if (![`In Progress`, "Not Started"].includes(attempt.status)) {
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

      // Calculate final score
      let finalScore: number;

      if (attempt.hasNegativeMark) {
        const penalty = attempt.wrongAnswers * attempt.negativeMark;
        finalScore = attempt.correctAnswers - penalty;
        finalScore = Math.max(0, finalScore);
      } else {
        finalScore = attempt.correctAnswers;
      }

      return ctx.db.publicExamAttempt.update({
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
  getPublicResult: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.publicExamAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          exam: true,
          participant: true,
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

      return attempt;
    }),

  // Get public merit list
  getPublicMeritList: publicProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      // Get exam details
      const exam = await ctx.db.exam.findUnique({
        where: { id: examId },
        select: {
          id: true,
          title: true,
          total: true,
          status: true,
          isPublic: true,
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      if (!exam.isPublic) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This exam is not public",
        });
      }

      // Get all public attempts for this exam
      const attempts = await ctx.db.publicExamAttempt.findMany({
        where: {
          examId,
          status: "Submitted",
        },
        select: {
          id: true,
          score: true,
          participant: {
            select: {
              id: true,
              name: true,
              class: true,
              college: true,
              phone: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
      });

      // Calculate percentages and rankings
      const totalAttempts = attempts.length;
      const meritList = attempts.map((attempt, index) => {
        const percentage = (attempt.score / exam.total) * 100;
        const rank = index + 1;

        const studentsBelow = totalAttempts - rank;
        const percentile =
          totalAttempts > 1
            ? Math.round((studentsBelow / (totalAttempts - 1)) * 100)
            : 100;

        // Mask phone number for privacy (show only last 4 digits)
        const maskedPhone = "******" + attempt.participant.phone.slice(-4);

        return {
          id: attempt.id,
          name: attempt.participant.name,
          class: attempt.participant.class,
          college: attempt.participant.college,
          phone: maskedPhone,
          score: attempt.score,
          total: exam.total,
          percentage: parseFloat(percentage.toFixed(2)),
          rank,
          percentile,
          examId: exam.id,
        };
      });

      // Calculate average score
      const avgScore =
        meritList.length > 0
          ? meritList.reduce((sum, m) => sum + m.percentage, 0) /
            meritList.length
          : 0;

      return {
        exam: {
          id: exam.id,
          title: exam.title,
          total: exam.total,
          status: exam.status,
          avgScore: parseFloat(avgScore.toFixed(1)),
          totalParticipants: meritList.length,
        },
        meritList,
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
