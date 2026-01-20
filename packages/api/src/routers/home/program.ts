import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import z from "zod";

export const programRouter = {
  getProgramsForHome: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.program.findMany({
      where: {
        isActive: true,
      },
      include: {
        packages: true,
      },
    });
    return programs;
  }),
  // Get program for landing page (public)
  getOneProgram: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: {
          id: input.id,
          isActive: true,
        },
        include: {
          batches: {
            include: {
              batch: {
                include: {
                  className: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          packages: {
            where: { isActive: true },
            orderBy: { isRecommended: "desc" },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
          syllabus: {
            include: {
              subject: true,
              chapters: {
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
          schedule: {
            orderBy: { orderIndex: "asc" },
          },
          mockTestPlan: {
            orderBy: { orderIndex: "asc" },
          },
          examStrategies: {
            orderBy: { orderIndex: "asc" },
          },
          medicalTopics: {
            orderBy: { orderIndex: "asc" },
          },
          specialBenefits: {
            orderBy: { orderIndex: "asc" },
          },
          faqs: {
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found",
        });
      }

      return program;
    }),
} satisfies TRPCRouterRecord;
