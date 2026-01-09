import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { SubjectSchema } from "@workspace/schema";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@workspace/db";

export const subjectRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(SubjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, level } = input;

      try {
        const existingSubject = await ctx.db.subject.findFirst({
          where: {
            name,
          },
        });

        if (existingSubject) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Subject already exists",
            cause: existingSubject,
          });
        }

        const subject = await ctx.db.subject.create({
          data: {
            name,
            level,
          },
        });

        return { success: true, message: "Subject created" };
      } catch (error) {
        console.error("Error creating class", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
          cause: error,
        });
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...SubjectSchema.shape,
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      try {
        const existingSubject = await ctx.db.subject.findUnique({
          where: { id },
        });

        if (!existingSubject) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Subject not found",
          });
        }

        await ctx.db.subject.update({
          where: { id },
          data: {
            name: data.name,
            level: data.level,
          },
        });

        return { success: true, message: "Subject updated" };
      } catch (error) {
        console.error("Error updating subject", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
          cause: error,
        });
      }
    }),

  deleteOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      try {
        const existingSubject = await ctx.db.subject.findUnique({
          where: { id },
        });

        if (!existingSubject) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Subject not found",
          });
        }

        await ctx.db.subject.delete({
          where: { id },
        });

        return { success: true, message: "Subject deleted" };
      } catch (error) {
        console.error("Error deleting subject", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
          cause: error,
        });
      }
    }),

  getOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const subject = await ctx.db.subject.findUnique({
        where: { id },
      });

      if (!subject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject not found",
        });
      }

      return subject;
    }),

  forSelect: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const subjects = await ctx.db.subject.findMany({
        where: {
          ...(search && {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
      });

      return subjects;
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().optional(),
        search: z.string().optional(),
        group: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, sort, search, group } = input;

      const where: Prisma.SubjectWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(group && { group }),
      };

      // Execute all queries in parallel
      const [subjects, totalCount] = await Promise.all([
        // Paginated subject list
        ctx.db.subject.findMany({
          where,
          include: {
            _count: {
              select: {
                chapters: true,
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.subject.count({ where }),
      ]);

      return {
        subjects,
        totalCount,
      };
    }),
});
