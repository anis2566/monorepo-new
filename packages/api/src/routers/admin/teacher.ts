import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@workspace/db";
import { TeacherSchema } from "@workspace/schema";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const teacherRouter = {
  createOne: adminProcedure
    .input(TeacherSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, institute, imageUrl, subject } = input;

      // Check for duplicate name
      const existingTeacher = await ctx.db.teacher.findFirst({
        where: { name },
        select: { id: true },
      });

      if (existingTeacher) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Teacher name already exists",
        });
      }

      await ctx.db.teacher.create({
        data: {
          name,
          institute,
          imageUrl,
          subject,
        },
      });

      return {
        success: true,
        message: "Teacher created successfully",
      };
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...TeacherSchema.shape,
        teacherId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { teacherId, name, institute, imageUrl, subject } = input;

      const existingTeacher = await ctx.db.teacher.findUnique({
        where: { id: teacherId },
        select: { id: true, name: true },
      });

      const nameConflict = await ctx.db.teacher.findFirst({
        where: {
          name,
          id: { not: teacherId },
        },
        select: { id: true },
      });

      if (!existingTeacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teacher not found",
        });
      }

      if (nameConflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Teacher name already exists",
        });
      }

      const updatedTeacher = await ctx.db.teacher.update({
        where: { id: teacherId },
        data: {
          name,
          institute,
          imageUrl,
          subject,
        },
      });

      return {
        success: true,
        message: "Teacher updated successfully",
        data: updatedTeacher,
      };
    }),

  getOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const teacher = await ctx.db.teacher.findUnique({
        where: { id },
      });

      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teacher not found",
        });
      }

      return teacher;
    }),

  forSelect: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.TeacherWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const teachers = await ctx.db.teacher.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return teachers;
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        await ctx.db.teacher.delete({
          where: { id },
        });

        return { success: true, message: "Teacher deleted successfully" };
      } catch (error) {
        // Check if it's a Prisma record not found error
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Teacher not found",
          });
        }

        // Check for foreign key constraint violation
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2003"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot delete teacher as it is being used by batches",
          });
        }

        // Re-throw unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete teacher",
          cause: error,
        });
      }
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        subject: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, subject } = input;

      const where: Prisma.TeacherWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(subject && {
          subject: {
            contains: subject,
            mode: "insensitive",
          },
        }),
      };

      const [teachers, totalCount] = await Promise.all([
        ctx.db.teacher.findMany({
          where,
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.teacher.count({ where }),
      ]);

      return {
        teachers,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
