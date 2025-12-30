import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@workspace/db";
import { InstituteSchema } from "@workspace/schema";

import { adminProcedure } from "../../trpc";

export const instituteRouter = {
  createOne: adminProcedure
    .input(InstituteSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, session } = input;

      // Check for duplicate name
      const existingInstitute = await ctx.db.institute.findUnique({
        where: { session_name: { session, name } },
        select: { id: true },
      });

      if (existingInstitute) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Institute name already exists",
        });
      }

      const newClass = await ctx.db.institute.create({
        data: {
          name,
          session,
        },
      });

      return {
        success: true,
        message: "Institute created successfully",
      };
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...InstituteSchema.shape,
        instituteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { instituteId, name, session } = input;

      const existingInstitute = await ctx.db.institute.findUnique({
        where: { id: instituteId },
        select: { id: true, name: true },
      });

      const nameConflict = await ctx.db.institute.findFirst({
        where: {
          name,
          id: { not: instituteId },
        },
        select: { id: true },
      });

      if (!existingInstitute) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Institute not found",
        });
      }

      if (nameConflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Institute name already exists",
        });
      }

      await ctx.db.institute.update({
        where: { id: instituteId },
        data: {
          name,
          session,
        },
      });

      return {
        success: true,
        message: "Institute updated successfully",
      };
    }),

  forSelect: adminProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.InstituteWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const institutes = await ctx.db.institute.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return institutes;
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const institute = await ctx.db.institute.findUnique({
          where: { id },
        });

        if (!institute) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Institute not found",
          });
        }

        await ctx.db.institute.delete({
          where: { id },
        });

        return { success: true, message: "Institute deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete institute",
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
        session: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, session } = input;

      const where: Prisma.InstituteWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(session && {
          session,
        }),
      };

      const [institutes, totalCount] = await Promise.all([
        ctx.db.institute.findMany({
          where,
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.institute.count({ where }),
      ]);

      return {
        institutes,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
