import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure } from "../../trpc";
import { BatchSchema } from "@workspace/schema";
import { sortTimeSlots } from "@workspace/utils/constant";
import { Prisma } from "@workspace/db";

const handleError = (error: unknown, operation: string) => {
  console.error(`Error ${operation}:`, error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};

export const batchRouter = {
  createOne: adminProcedure
    .input(BatchSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, classNameId } = input;

      console.log(classNameId);

      try {
        const existingBatch = await ctx.db.batch.findFirst({
          where: { classNameId, name },
          select: { id: true },
        });

        console.log(existingBatch);

        if (existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch already exists",
          });
        }

        await ctx.db.batch.create({
          data: {
            name,
            classNameId,
          },
        });

        return {
          success: true,
          message: "Batch created successfully",
        };
      } catch (error) {
        return handleError(error, "creating batch");
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...BatchSchema.shape,
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, classNameId } = input;

      try {
        // Parallel validation
        const existingBatch = await ctx.db.batch.findUnique({
          where: { id },
        });

        const nameConflict = await ctx.db.batch.findFirst({
          where: {
            classNameId,
            name,
            id: { not: id },
          },
          select: { id: true },
        });

        if (!existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }

        if (nameConflict) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch with this name and class already exists",
          });
        }

        await ctx.db.batch.update({
          where: { id },
          data: {
            name,
            classNameId,
          },
        });

        return { success: true, message: "Batch updated successfully" };
      } catch (error) {
        return handleError(error, "updating batch");
      }
    }),

  deleteOne: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBatch = await ctx.db.batch.findUnique({
          where: { id: input },
        });

        if (!existingBatch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }

        await ctx.db.batch.delete({
          where: { id: input },
        });

        return { success: true, message: "Batch deleted successfully" };
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Batch not found",
          });
        }
        return handleError(error, "deleting batch");
      }
    }),

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const batchData = await ctx.db.batch.findUnique({
      where: { id: input },
    });

    if (!batchData) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Batch not found",
      });
    }

    return batchData;
  }),

  forSelect: adminProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const where: Prisma.BatchWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      };

      const batches = await ctx.db.batch.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return batches;
    }),

  getByClassNameId: adminProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return [];
      }

      const batchData = await ctx.db.batch.findMany({
        where: { classNameId: input },
      });

      return batchData;
    }),

  getByClassNameIds: adminProcedure
    .input(z.array(z.string()).optional())
    .query(async ({ ctx, input }) => {
      if (!input || !input.length) {
        return [];
      }

      const batchData = await ctx.db.batch.findMany({
        where: {
          classNameId: {
            in: input,
          },
        },
      });

      return batchData;
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        classNameId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, classNameId } = input;

      const where: Prisma.BatchWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(classNameId &&
          classNameId !== "All" && { classNameId: { equals: classNameId } }),
      };

      const [batches, totalCount] = await Promise.all([
        ctx.db.batch.findMany({
          where,
          include: {
            className: {
              select: {
                name: true,
              },
            },
            _count: {
              select: { students: true, exams: true },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.batch.count({ where }),
      ]);

      return {
        batches,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
