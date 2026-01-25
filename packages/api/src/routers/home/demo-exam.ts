import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import { z } from "zod";

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

function normalizeOptionLabel(label: string): string {
  if (BANGLA_TO_ENGLISH_MAP[label]) {
    return BANGLA_TO_ENGLISH_MAP[label];
  }
  if (/^[A-Z]$/i.test(label)) {
    return label.toUpperCase();
  }
  return label;
}

export const demoExamRouter = {
  // Get all subjects with chapters and topics for selection UI
  getSubjectsWithChapters: publicProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.db.subject.findMany({
      include: {
        chapters: {
          include: {
            topics: {
              include: {
                _count: {
                  select: {
                    mcqs: true,
                  },
                },
              },
              orderBy: { position: "asc" },
            },
            _count: {
              select: {
                mcqs: true, // Count MCQs per chapter
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        _count: {
          select: {
            mcqs: true, // Count MCQs per subject
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      questionCount: subject._count.mcqs,
      chapters: subject.chapters.map((chapter) => ({
        id: chapter.id,
        name: chapter.name,
        questionCount: chapter._count.mcqs,
        topics: chapter.topics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          questionCount: topic._count.mcqs,
        })),
      })),
    }));
  }),

  // Get MCQs for practice based on filters (no demo exam creation)
  getPracticeMcqs: publicProcedure
    .input(
      z.object({
        selectedSubjects: z
          .array(z.string())
          .min(1, "At least one subject required"),
        selectedChapters: z.array(z.string()).optional().default([]),
        selectedTopics: z.array(z.string()).optional().default([]),
        questionCount: z.number().min(10).max(100),
        shuffleQuestions: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Build query filter for MCQ selection
      const mcqFilter: any = {
        OR: [],
      };

      // Priority: Topics > Chapters > Subjects
      if (input.selectedTopics && input.selectedTopics.length > 0) {
        // Note: If you have a topic field in your schema, filter by it
        // For now, we'll filter by chapters if topics are selected
        mcqFilter.OR.push({
          chapterId: {
            in: input.selectedChapters,
          },
        });
      } else if (input.selectedChapters.length > 0) {
        // Filter by chapters
        mcqFilter.OR.push({
          chapterId: {
            in: input.selectedChapters,
          },
        });
      } else {
        // Filter by subjects
        mcqFilter.OR.push({
          subjectId: {
            in: input.selectedSubjects,
          },
        });
      }

      // Get available MCQs
      const availableMcqs = await ctx.db.mcq.findMany({
        where: mcqFilter,
        include: {
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
          chapter: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (availableMcqs.length < input.questionCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough questions available. Found ${availableMcqs.length}, but ${input.questionCount} requested.`,
        });
      }

      // Randomly select questions
      const shuffled = input.shuffleQuestions
        ? shuffleArray(availableMcqs)
        : availableMcqs;
      const selectedMcqs = shuffled.slice(0, input.questionCount);

      return {
        questions: selectedMcqs,
        totalAvailable: availableMcqs.length,
      };
    }),

  // Create practice session based on selected filters
  createPracticeSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        selectedSubjects: z
          .array(z.string())
          .min(1, "At least one subject required"),
        selectedChapters: z.array(z.string()).optional().default([]),
        selectedTopics: z.array(z.string()).optional().default([]),
        questionCount: z.number().min(10).max(100),
        timeLimit: z.number().min(10).max(180), // minutes
        hasNegativeMark: z.boolean().default(false),
        negativeMark: z.number().default(0.25),
        shuffleQuestions: z.boolean().default(true),
        participantName: z.string().optional(),
        participantEmail: z.string().email().optional().or(z.literal("")),
        participantPhone: z
          .string()
          .regex(/^01[0-9]{9}$/)
          .optional()
          .or(z.literal("")),
        ipAddress: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if session already has an active attempt
      const existingAttempt = await ctx.db.demoExamAttempt.findFirst({
        where: {
          sessionId: input.sessionId,
          status: {
            in: ["Not Started", "In Progress"],
          },
        },
      });

      if (existingAttempt) {
        return {
          attemptId: existingAttempt.id,
          demoExamId: existingAttempt.demoExamId,
          isNew: false,
          message: "Resuming existing practice session",
        };
      }

      // Build query filter for MCQ selection
      const mcqFilter: any = {
        OR: [],
      };

      // Priority: Topics > Chapters > Subjects
      if (input.selectedTopics && input.selectedTopics.length > 0) {
        // Filter by topics (if topics are stored in your schema)
        // Assuming you have a topic field or relation
        mcqFilter.OR.push({
          chapterId: {
            in: input.selectedChapters,
          },
        });
      } else if (input.selectedChapters.length > 0) {
        // Filter by chapters
        mcqFilter.OR.push({
          chapterId: {
            in: input.selectedChapters,
          },
        });
      } else {
        // Filter by subjects
        mcqFilter.OR.push({
          subjectId: {
            in: input.selectedSubjects,
          },
        });
      }

      // Get available MCQs
      const availableMcqs = await ctx.db.mcq.findMany({
        where: mcqFilter,
        select: {
          id: true,
        },
      });

      if (availableMcqs.length < input.questionCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough questions available. Found ${availableMcqs.length}, but ${input.questionCount} requested.`,
        });
      }

      // Randomly select questions
      const shuffled = input.shuffleQuestions
        ? shuffleArray(availableMcqs)
        : availableMcqs;
      const selectedMcqs = shuffled.slice(0, input.questionCount);

      // Create a demo exam
      const demoExam = await ctx.db.demoExam.create({
        data: {
          title: "Practice Session",
          total: input.questionCount,
          duration: input.timeLimit,
          mcq: input.questionCount,
          hasNegativeMark: input.hasNegativeMark,
          negativeMark: input.negativeMark,
          hasShuffle: input.shuffleQuestions,
          hasRandom: true,
          subjects: input.selectedSubjects,
          chapters: input.selectedChapters,
          status: "Active",
        },
      });

      // Associate MCQs with demo exam
      await ctx.db.demoExamMcq.createMany({
        data: selectedMcqs.map((mcq, index) => ({
          demoExamId: demoExam.id,
          mcqId: mcq.id,
          position: index,
        })),
      });

      // Create attempt
      const attempt = await ctx.db.demoExamAttempt.create({
        data: {
          demoExamId: demoExam.id,
          sessionId: input.sessionId,
          totalQuestions: input.questionCount,
          skippedQuestions: input.questionCount,
          hasNegativeMark: input.hasNegativeMark,
          negativeMark: input.negativeMark,
          status: "In Progress",
          startTime: new Date(),
          answers: [],
          participantName: input.participantName || null,
          participantEmail: input.participantEmail || null,
          participantPhone: input.participantPhone || null,
          ipAddress: input.ipAddress || null,
        },
      });

      return {
        attemptId: attempt.id,
        demoExamId: demoExam.id,
        isNew: true,
        message: "Practice session created successfully",
      };
    }),

  // Get practice session questions
  getPracticeQuestions: publicProcedure
    .input(z.object({ demoExamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const demoExam = await ctx.db.demoExam.findUnique({
        where: { id: input.demoExamId },
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
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!demoExam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Practice session not found",
        });
      }

      const questions = demoExam.mcqs.map((em, index) => ({
        questionNumber: index + 1,
        ...em.mcq,
      }));

      return {
        exam: {
          id: demoExam.id,
          title: demoExam.title,
          total: demoExam.total,
          duration: demoExam.duration,
          hasNegativeMark: demoExam.hasNegativeMark,
          negativeMark: demoExam.negativeMark,
          totalQuestions: questions.length,
        },
        questions: demoExam.hasShuffle ? shuffleArray(questions) : questions,
      };
    }),

  // Get current attempt status
  getAttemptStatus: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.demoExamAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          demoExam: {
            select: {
              id: true,
              title: true,
              duration: true,
              total: true,
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

      // Calculate elapsed time
      const elapsedTime = attempt.startTime
        ? Math.floor(
            (new Date().getTime() - attempt.startTime.getTime()) / 1000,
          )
        : 0;

      return {
        ...attempt,
        elapsedTime,
      };
    }),

  // Submit an answer
  submitAnswer: publicProcedure
    .input(
      z.object({
        attemptId: z.string(),
        mcqId: z.string(),
        selectedOption: z.string(),
        correctAnswer: z.string(),
        timeSpent: z.number().optional().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.demoExamAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attempt not found",
        });
      }

      if (attempt.status !== "In Progress") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Practice session is not in progress",
        });
      }

      // Check if already answered
      const answers = attempt.answers as any[];
      const existingAnswerIndex = answers.findIndex(
        (a: any) => a.mcqId === input.mcqId,
      );

      // Normalize labels
      const normalizedSelected = normalizeOptionLabel(input.selectedOption);
      const normalizedCorrect = normalizeOptionLabel(input.correctAnswer);

      const isCorrect = normalizedSelected === normalizedCorrect;

      // If updating an existing answer
      if (existingAnswerIndex !== -1) {
        const oldAnswer = answers[existingAnswerIndex];
        const wasCorrect = oldAnswer.isCorrect;

        // Update the answer
        answers[existingAnswerIndex] = {
          mcqId: input.mcqId,
          selectedOption: normalizedSelected,
          isCorrect,
          answeredAt: new Date().toISOString(),
          timeSpent: input.timeSpent,
        };

        // Recalculate metrics
        let newCorrect = attempt.correctAnswers;
        let newWrong = attempt.wrongAnswers;

        if (wasCorrect && !isCorrect) {
          newCorrect--;
          newWrong++;
        } else if (!wasCorrect && isCorrect) {
          newCorrect++;
          newWrong--;
        }

        // Calculate score
        let newScore: number;
        if (attempt.hasNegativeMark) {
          const penalty = newWrong * attempt.negativeMark;
          newScore = newCorrect - penalty;
          newScore = Math.max(0, newScore);
        } else {
          newScore = newCorrect;
        }

        const updatedAttempt = await ctx.db.demoExamAttempt.update({
          where: { id: input.attemptId },
          data: {
            answers: answers,
            correctAnswers: newCorrect,
            wrongAnswers: newWrong,
            score: newScore,
          },
        });

        return {
          attempt: updatedAttempt,
          isCorrect,
          score: newScore,
          wasUpdated: true,
        };
      }

      // New answer
      const newCorrect = isCorrect
        ? attempt.correctAnswers + 1
        : attempt.correctAnswers;
      const newWrong = !isCorrect
        ? attempt.wrongAnswers + 1
        : attempt.wrongAnswers;
      const newAnswered = attempt.answeredCount + 1;
      const newSkipped = attempt.totalQuestions - newAnswered;

      // Calculate score
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

      const updatedAttempt = await ctx.db.demoExamAttempt.update({
        where: { id: input.attemptId },
        data: {
          answers: {
            push: answerObj,
          },
          correctAnswers: newCorrect,
          wrongAnswers: newWrong,
          skippedQuestions: newSkipped,
          answeredCount: newAnswered,
          score: newScore,
        },
      });

      return {
        attempt: updatedAttempt,
        isCorrect,
        score: newScore,
        wasUpdated: false,
      };
    }),

  // Submit practice session
  submitPractice: publicProcedure
    .input(
      z.object({
        attemptId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.demoExamAttempt.findUnique({
        where: { id: input.attemptId },
      });

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attempt not found",
        });
      }

      if (attempt.status === "Submitted") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Practice session already submitted",
        });
      }

      const now = new Date();
      const duration = attempt.startTime
        ? Math.floor((now.getTime() - attempt.startTime.getTime()) / 1000)
        : 0;

      // Calculate final score
      let finalScore: number;
      if (attempt.hasNegativeMark) {
        const penalty = attempt.wrongAnswers * attempt.negativeMark;
        finalScore = attempt.correctAnswers - penalty;
        finalScore = Math.max(0, finalScore);
      } else {
        finalScore = attempt.correctAnswers;
      }

      return ctx.db.demoExamAttempt.update({
        where: { id: input.attemptId },
        data: {
          status: "Submitted",
          endTime: now,
          duration,
          score: finalScore,
        },
      });
    }),

  // Get practice result with detailed breakdown
  getPracticeResult: publicProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.demoExamAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          demoExam: {
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
                orderBy: {
                  position: "asc",
                },
              },
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

      // Match answers with questions
      const answers = attempt.answers as any[];
      const questionsWithAnswers = attempt.demoExam.mcqs.map(
        (examMcq, index) => {
          const answer = answers.find((a: any) => a.mcqId === examMcq.mcqId);
          return {
            questionNumber: index + 1,
            mcq: examMcq.mcq,
            selectedOption: answer?.selectedOption,
            isCorrect: answer?.isCorrect ?? null,
            timeSpent: answer?.timeSpent,
            answeredAt: answer?.answeredAt,
          };
        },
      );

      // Calculate subject-wise performance
      const subjectPerformance = questionsWithAnswers.reduce(
        (acc, q) => {
          const subjectId = q.mcq.subjectId;
          const subjectName = q.mcq.subject.name;

          if (!acc[subjectId]) {
            acc[subjectId] = {
              subjectId,
              subjectName,
              total: 0,
              correct: 0,
              wrong: 0,
              skipped: 0,
            };
          }

          acc[subjectId].total++;
          if (q.isCorrect === true) acc[subjectId].correct++;
          else if (q.isCorrect === false) acc[subjectId].wrong++;
          else acc[subjectId].skipped++;

          return acc;
        },
        {} as Record<string, any>,
      );

      // Calculate chapter-wise performance
      const chapterPerformance = questionsWithAnswers.reduce(
        (acc, q) => {
          const chapterId = q.mcq.chapterId;
          const chapterName = q.mcq.chapter?.name || "Unknown";

          if (!acc[chapterId]) {
            acc[chapterId] = {
              chapterId,
              chapterName,
              total: 0,
              correct: 0,
              wrong: 0,
              skipped: 0,
            };
          }

          acc[chapterId].total++;
          if (q.isCorrect === true) acc[chapterId].correct++;
          else if (q.isCorrect === false) acc[chapterId].wrong++;
          else acc[chapterId].skipped++;

          return acc;
        },
        {} as Record<string, any>,
      );

      return {
        attempt: {
          id: attempt.id,
          score: attempt.score,
          correctAnswers: attempt.correctAnswers,
          wrongAnswers: attempt.wrongAnswers,
          skippedQuestions: attempt.skippedQuestions,
          answeredCount: attempt.answeredCount,
          totalQuestions: attempt.totalQuestions,
          duration: attempt.duration,
          status: attempt.status,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          participantName: attempt.participantName,
        },
        exam: {
          id: attempt.demoExam.id,
          title: attempt.demoExam.title,
          total: attempt.demoExam.total,
          duration: attempt.demoExam.duration,
        },
        questions: questionsWithAnswers,
        subjectPerformance: Object.values(subjectPerformance),
        chapterPerformance: Object.values(chapterPerformance),
      };
    }),

  // Get practice history for a session
  getPracticeHistory: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempts = await ctx.db.demoExamAttempt.findMany({
        where: {
          sessionId: input.sessionId,
          status: "Submitted",
        },
        include: {
          demoExam: {
            select: {
              id: true,
              title: true,
              total: true,
              subjects: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

      return attempts.map((attempt) => ({
        id: attempt.id,
        examTitle: attempt.demoExam.title,
        subjects: attempt.demoExam.subjects,
        score: attempt.score,
        total: attempt.demoExam.total,
        percentage: parseFloat(
          ((attempt.score / attempt.demoExam.total) * 100).toFixed(2),
        ),
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        skippedQuestions: attempt.skippedQuestions,
        duration: attempt.duration,
        completedAt: attempt.endTime,
      }));
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
