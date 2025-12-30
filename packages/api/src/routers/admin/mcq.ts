import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { McqsSchema } from "@workspace/schema";
import { Prisma } from "@workspace/db";
import { MCQ_TYPE } from "@workspace/utils/constant";

export const mcqRouter = createTRPCRouter({
    createMany: adminProcedure
        .input(McqsSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.mcq.createMany({
                    data: input.map((mcq) => ({
                        ...mcq,
                        session: new Date().getFullYear(),
                        isMath: mcq.isMath ? true : false,
                    })),
                });

                return { success: true, message: "MCQ created" };
            } catch (error) {
                console.error("Error creating mcq", error);

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
                id: z.string(),
                data: z.object({
                    question: z.string(),
                    statements: z.array(z.string()),
                    options: z.array(z.string()),
                    answer: z.string(),
                    explanation: z.string().nullable(),
                    context: z.string().nullable(),
                    reference: z.array(z.string()),
                    isMath: z.boolean().nullable(),
                    type: z.string(),
                }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, data } = input;

            console.log(data);

            try {
                const existingMcq = await ctx.db.mcq.findUnique({
                    where: {
                        id,
                    },
                });

                if (!existingMcq) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "MCQ not found",
                    });
                }

                await ctx.db.mcq.update({
                    where: {
                        id,
                    },
                    data: {
                        ...data,
                        isMath: data.isMath ? true : false,
                    },
                });

                return { success: true, message: "MCQ updated" };
            } catch (error) {
                console.error("Error updating mcq", error);

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
                const existingMcq = await ctx.db.mcq.findUnique({
                    where: {
                        id,
                    },
                });

                if (!existingMcq) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "MCQ not found",
                    });
                }

                await ctx.db.mcq.delete({
                    where: {
                        id,
                    },
                });

                return { success: true, message: "MCQ deleted" };
            } catch (error) {
                console.error("Error deleting mcq", error);

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

    getManyByChapter: adminProcedure
        .input(
            z.object({
                chapterId: z.string(),
                search: z.string().optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { chapterId } = input;

            const mcqs = await ctx.db.mcq.findMany({
                where: {
                    chapterId,
                    question: {
                        contains: input.search,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            return mcqs;
        }),

    getMany: adminProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                search: z.string().nullish(),
                subjectId: z.string().nullish(),
                chapterId: z.string().nullish(),
                type: z.string().nullish(),
                isMath: z.boolean().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { page, limit, sort, search, subjectId, chapterId, type, isMath } =
                input;

            const where: Prisma.McqWhereInput = {
                ...(search && {
                    question: {
                        contains: search,
                        mode: "insensitive",
                    },
                }),
                ...(subjectId && {
                    subjectId,
                }),
                ...(chapterId && {
                    chapterId,
                }),
                ...(type && {
                    type,
                }),
                ...(isMath && {
                    isMath,
                }),
            };

            const [
                mcqs,
                totalCount,
                totalMcqs,
                singleMcqs,
                multipleMcqs,
                contextualMcqs,
            ] = await Promise.all([
                ctx.db.mcq.findMany({
                    where,
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
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                    take: limit,
                    skip: (page - 1) * limit,
                }),
                ctx.db.mcq.count({
                    where,
                }),
                ctx.db.mcq.count(),
                ctx.db.mcq.count({
                    where: {
                        type: MCQ_TYPE.Single,
                    },
                }),
                ctx.db.mcq.count({
                    where: {
                        type: MCQ_TYPE.Multiple,
                    },
                }),
                ctx.db.mcq.count({
                    where: {
                        type: MCQ_TYPE.Contextual,
                    },
                }),
            ]);

            return {
                mcqs,
                totalCount,
                totalMcqs,
                singleMcqs,
                multipleMcqs,
                contextualMcqs,
            };
        }),
});