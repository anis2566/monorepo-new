import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import z from "zod";

export const courseRouter = {
  getCoursesForHome: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { type } = input;
      const courses = await ctx.db.course.findMany({
        where: {
          ...(type && type !== "all" && { type }),
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          classes: true,
          subjects: true,
        },
      });

      return courses;
    }),
  // Get program for landing page (public)
  getOneCourse: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await ctx.db.course.findUnique({
        where: {
          id: input.id,
          isActive: true,
        },
        include: {
          classes: {
            include: {
              className: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course;
    }),

  getManyCourses: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { type, search } = input;
      console.log(type, search);

      const [courses, totalCourse, students] = await Promise.all([
        ctx.db.course.findMany({
          where: {
            ...(type && type !== "all" && { type }),
            isActive: true,
            ...(search && { name: { contains: search, mode: "insensitive" } }),
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            classes: true,
            subjects: true,
          },
        }),
        ctx.db.course.count({
          where: {
            ...(type && type !== "all" && { type }),
            isActive: true,
            ...(search && { name: { contains: search, mode: "insensitive" } }),
          },
        }),
        ctx.db.student.count(),
      ]);

      return {
        courses,
        totalCourse,
        students,
      };
    }),
} satisfies TRPCRouterRecord;
