import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@workspace/db";
import { TopicSchema } from "@workspace/schema";

import { adminProcedure, publicProcedure } from "../../trpc";

export const topicRouter = {
  createOne: adminProcedure
    .input(TopicSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, position, chapterId, subjectId } = input;

      // Check for duplicate name
      const existingClass = await ctx.db.topic.findFirst({
        where: { name, chapterId, subjectId },
        select: { id: true },
      });

      if (existingClass) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Topic name already exists",
        });
      }

      const newClass = await ctx.db.topic.create({
        data: {
          name,
          position: Number(position),
          chapterId,
          subjectId,
        },
      });

      return {
        success: true,
        message: "Topic created successfully",
        data: newClass,
      };
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...TopicSchema.shape,
        topicId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { topicId, name, position, chapterId, subjectId } = input;

      const existingClass = await ctx.db.topic.findUnique({
        where: { id: topicId },
        select: { id: true, name: true },
      });

      const nameConflict = await ctx.db.topic.findFirst({
        where: {
          name,
          id: { not: topicId },
          chapterId,
          subjectId,
        },
        select: { id: true },
      });

      if (!existingClass) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      if (nameConflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Topic name already exists",
        });
      }

      const updatedClass = await ctx.db.topic.update({
        where: { id: topicId },
        data: {
          name,
          position: Number(position),
          chapterId,
          subjectId,
        },
      });

      return {
        success: true,
        message: "Topic updated successfully",
        data: updatedClass,
      };
    }),

  forSelect: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.TopicWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const classes = await ctx.db.topic.findMany({
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
        await ctx.db.topic.delete({
          where: { id },
        });

        return { success: true, message: "Topic deleted successfully" };
      } catch (error) {
        // Check if it's a Prisma record not found error
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Topic not found",
          });
        }

        // Check for foreign key constraint violation
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2003"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot delete topic as it is being used by students",
          });
        }

        // Re-throw unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete topic",
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
        subjectId: z.string().nullish(),
        chapterId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, subjectId, chapterId } = input;

      const where: Prisma.TopicWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(subjectId && { subjectId }),
        ...(chapterId && { chapterId }),
      };

      const [topics, totalCount] = await Promise.all([
        ctx.db.topic.findMany({
          where,
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          include: {
            subject: {
              select: {
                name: true,
              },
            },
            chapter: {
              select: {
                name: true,
              },
            },
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.topic.count({ where }),
      ]);

      return {
        topics,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }),
} satisfies TRPCRouterRecord;
