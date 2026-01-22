import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const serviceRouter = createTRPCRouter({
  // MCQ Question Bank
  getMcqQuestionBank: publicProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
          subjectId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      // Fetch subjects with nested relations
      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(input?.level ? { level: input.level } : {}),
          ...(input?.subjectId ? { id: input.subjectId } : {}),
        },
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
                  mcqs: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
          _count: {
            select: {
              mcqs: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });

      // Transform to match the desired structure
      return subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        chapters: subject.chapters.map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          position: chapter.position,
          totalQuestions: chapter._count.mcqs,
          topics: chapter.topics.map((topic) => ({
            id: topic.id,
            name: topic.name,
            position: topic.position,
            questionCount: topic._count.mcqs,
          })),
        })),
        totalQuestions: subject._count.mcqs,
      }));
    }),

  // CQ (Creative Questions) Question Bank
  getCqQuestionBank: publicProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
          subjectId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(input?.level ? { level: input.level } : {}),
          ...(input?.subjectId ? { id: input.subjectId } : {}),
        },
        include: {
          chapters: {
            include: {
              topics: {
                include: {
                  _count: {
                    select: {
                      cqs: true,
                    },
                  },
                },
                orderBy: { position: "asc" },
              },
              _count: {
                select: {
                  cqs: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
          _count: {
            select: {
              cqs: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });

      return subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        chapters: subject.chapters.map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          position: chapter.position,
          totalQuestions: chapter._count.cqs,
          topics: chapter.topics.map((topic) => ({
            id: topic.id,
            name: topic.name,
            position: topic.position,
            questionCount: topic._count.cqs,
          })),
        })),
        totalQuestions: subject._count.cqs,
      }));
    }),

  // Cognitive (জ্ঞানমূলক) Question Bank
  getCognitiveQuestionBank: publicProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
          subjectId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(input?.level ? { level: input.level } : {}),
          ...(input?.subjectId ? { id: input.subjectId } : {}),
        },
        include: {
          chapters: {
            include: {
              topics: {
                include: {
                  _count: {
                    select: {
                      cognitives: true,
                    },
                  },
                },
                orderBy: { position: "asc" },
              },
              _count: {
                select: {
                  cognitives: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
          _count: {
            select: {
              cognitives: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });

      return subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        chapters: subject.chapters.map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          position: chapter.position,
          totalQuestions: chapter._count.cognitives,
          topics: chapter.topics.map((topic) => ({
            id: topic.id,
            name: topic.name,
            position: topic.position,
            questionCount: topic._count.cognitives,
          })),
        })),
        totalQuestions: subject._count.cognitives,
      }));
    }),

  // Perceptual (অনুধাবনমূলক) Question Bank
  getPerceptualQuestionBank: publicProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
          subjectId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(input?.level ? { level: input.level } : {}),
          ...(input?.subjectId ? { id: input.subjectId } : {}),
        },
        include: {
          chapters: {
            include: {
              topics: {
                include: {
                  _count: {
                    select: {
                      perceptuals: true,
                    },
                  },
                },
                orderBy: { position: "asc" },
              },
              _count: {
                select: {
                  perceptuals: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
          _count: {
            select: {
              perceptuals: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });

      return subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        chapters: subject.chapters.map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          position: chapter.position,
          totalQuestions: chapter._count.perceptuals,
          topics: chapter.topics.map((topic) => ({
            id: topic.id,
            name: topic.name,
            position: topic.position,
            questionCount: topic._count.perceptuals,
          })),
        })),
        totalQuestions: subject._count.perceptuals,
      }));
    }),

  // Get all question types count for a subject
  getSubjectQuestionStats: publicProcedure
    .input(
      z.object({
        subjectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const subject = await ctx.db.subject.findUnique({
        where: { id: input.subjectId },
        include: {
          _count: {
            select: {
              mcqs: true,
              cqs: true,
              cognitives: true,
              perceptuals: true,
            },
          },
        },
      });

      if (!subject) {
        throw new Error("Subject not found");
      }

      return {
        id: subject.id,
        name: subject.name,
        level: subject.level,
        questionCounts: {
          mcq: subject._count.mcqs,
          cq: subject._count.cqs,
          cognitive: subject._count.cognitives,
          perceptual: subject._count.perceptuals,
          total:
            subject._count.mcqs +
            subject._count.cqs +
            subject._count.cognitives +
            subject._count.perceptuals,
        },
      };
    }),

  // Get all question banks combined (for dashboard/overview)
  getAllQuestionBanks: publicProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(input?.level ? { level: input.level } : {}),
        },
        include: {
          _count: {
            select: {
              mcqs: true,
              cqs: true,
              cognitives: true,
              perceptuals: true,
              chapters: true,
              topics: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });

      return subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        questionCounts: {
          mcq: subject._count.mcqs,
          cq: subject._count.cqs,
          cognitive: subject._count.cognitives,
          perceptual: subject._count.perceptuals,
          total:
            subject._count.mcqs +
            subject._count.cqs +
            subject._count.cognitives +
            subject._count.perceptuals,
        },
        stats: {
          chapters: subject._count.chapters,
          topics: subject._count.topics,
        },
      }));
    }),
});
