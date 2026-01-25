import { createTRPCRouter, publicProcedure } from "../../trpc";

export const teacherRouter = createTRPCRouter({
  getMany: publicProcedure.query(async ({ ctx }) => {
    const teachers = await ctx.db.teacher.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return teachers;
  }),
});
