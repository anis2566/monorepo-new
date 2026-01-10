import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@workspace/db";

import { adminProcedure } from "../../trpc";

export const userRouter = {
  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const user = await ctx.db.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await ctx.db.user.delete({
          where: { id },
        });

        return { success: true, message: "User deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user",
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
        email: z.string().nullish(),
        role: z.string().nullish(),
        status: z.string().nullish(),
        classNameId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sort, search, role, status, email, classNameId } =
        input;

      const where: Prisma.UserWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(email && {
          email,
        }),
        ...(role &&
          role !== "All" && {
            role,
          }),
        ...(status &&
          status !== "All" && {
            isVerifiedStudent: status === "Verified",
          }),
        ...(classNameId &&
          classNameId !== "All" && {
            student: {
              classNameId,
            },
          }),
      };

      const [users, totalCount] = await Promise.all([
        ctx.db.user.findMany({
          where,
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          include: {
            student: {
              select: {
                name: true,
                studentId: true,
                imageUrl: true,
                className: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.user.count({ where }),
      ]);

      return {
        users,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
