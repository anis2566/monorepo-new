import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@workspace/db";
import { ClassNameSchema } from "@workspace/schema";

import { adminProcedure, protectedProcedure } from "../../trpc";

export const classRouter = {
  createOne: adminProcedure
    .input(ClassNameSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;

      // Check for duplicate name
      const existingClass = await ctx.db.className.findFirst({
        where: { name },
        select: { id: true },
      });

      if (existingClass) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Class name already exists",
        });
      }

      const newClass = await ctx.db.className.create({
        data: {
          name,
          description,
        },
      });

      return {
        success: true,
        message: "Class created successfully",
        data: newClass,
      };
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...ClassNameSchema.shape,
        classId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { classId, name, description } = input;

      const existingClass = await ctx.db.className.findUnique({
        where: { id: classId },
        select: { id: true, name: true },
      });

      const nameConflict = await ctx.db.className.findFirst({
        where: {
          name,
          id: { not: classId },
        },
        select: { id: true },
      });

      if (!existingClass) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Class not found",
        });
      }

      if (nameConflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Class name already exists",
        });
      }

      const updatedClass = await ctx.db.className.update({
        where: { id: classId },
        data: {
          name,
          description,
        },
      });

      return {
        success: true,
        message: "Class updated successfully",
        data: updatedClass,
      };
    }),

  forSelect: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.ClassNameWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const classes = await ctx.db.className.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return classes;
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        await ctx.db.className.delete({
          where: { id },
        });

        return { success: true, message: "Class deleted successfully" };
      } catch (error) {
        // Check if it's a Prisma record not found error
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Class not found",
          });
        }

        // Check for foreign key constraint violation
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2003"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot delete class as it is being used by students",
          });
        }

        // Re-throw unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete class",
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
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search } = input;

      const where: Prisma.ClassNameWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const [classes, totalCount] = await Promise.all([
        ctx.db.className.findMany({
          where,
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.className.count({ where }),
      ]);

      return {
        classes,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }),
} satisfies TRPCRouterRecord;
