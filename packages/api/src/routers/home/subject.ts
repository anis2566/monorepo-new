import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const subjectRouter = createTRPCRouter({
  getByLevel: publicProcedure
    .input(
      z.object({
        level: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { level } = input;

      const subjects = await ctx.db.subject.findMany({
        where: { level },
        orderBy: {
          createdAt: "asc",
        },
      });

      return subjects;
    }),
});
