import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { ChapterSchema } from "@workspace/schema";
import { Prisma } from "@workspace/db";

export const chapterRouter = createTRPCRouter({
    createOne: adminProcedure
        .input(ChapterSchema)
        .mutation(async ({ ctx, input }) => {
            const { name, position, subjectId } = input;

            try {
                const existingChapter = await ctx.db.chapter.findFirst({
                    where: {
                        name,
                        subjectId,
                    },
                });

                if (existingChapter) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Chapter already exists",
                    });
                }

                const existingChapterPosition = await ctx.db.chapter.findFirst({
                    where: {
                        subjectId,
                        position: position ? Number(position) : undefined,
                    },
                });

                if (existingChapterPosition) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Chapter position already exists",
                    });
                }

                await ctx.db.chapter.create({
                    data: {
                        name,
                        position: position ? Number(position) : undefined,
                        subjectId,
                    },
                });

                return { success: true, message: "Chapter created" };
            } catch (error) {
                console.error("Error creating chapter", error);

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
                ...ChapterSchema.shape,
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, name, position, subjectId } = input;

            try {
                const existingChapter = await ctx.db.chapter.findFirst({
                    where: {
                        name,
                        subjectId,
                        NOT: {
                            id,
                        },
                    },
                });

                if (existingChapter) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Chapter already exists",
                    });
                }

                const existingChapterPosition = await ctx.db.chapter.findFirst({
                    where: {
                        subjectId,
                        position: position ? Number(position) : undefined,
                        NOT: {
                            id,
                        },
                    },
                });

                if (existingChapterPosition) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Chapter position already exists",
                    });
                }

                await ctx.db.chapter.update({
                    where: { id },
                    data: {
                        name,
                        position: position ? Number(position) : undefined,
                        subjectId,
                    },
                });

                return { success: true, message: "Chapter updated" };
            } catch (error) {
                console.error("Error updating chapter", error);

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
        .mutation(async ({ ctx, input }) => {
            const { id } = input;

            try {
                const existingChapter = await ctx.db.chapter.findUnique({
                    where: { id },
                });

                if (!existingChapter) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Chapter not found",
                    });
                }

                await ctx.db.chapter.delete({
                    where: { id },
                });

                return { success: true, message: "Chapter deleted" };
            } catch (error) {
                console.error("Error deleting chapter", error);

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

            const chapter = await ctx.db.chapter.findUnique({
                where: { id }
            });

            if (!chapter) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chapter not found",
                });
            }

            return chapter;
        }),

    getBySubject: adminProcedure
        .input(
            z.object({
                subjectId: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { subjectId } = input;

            if (!subjectId) {
                return [];
            }

            const chapters = await ctx.db.chapter.findMany({
                where: {
                    subjectId: subjectId,
                },
            });

            return chapters;
        }),

    getMany: adminProcedure
        .input(
            z.object({
                page: z.number(),
                limit: z.number().min(1).max(100),
                sort: z.string().nullish(),
                search: z.string().nullish(),
                subjectId: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { page, limit, sort, search, subjectId } = input;

            const where: Prisma.ChapterWhereInput = {
                ...(search && {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                }),
                ...(subjectId && { subjectId }),
            };

            const [chapters, totalCount] = await Promise.all([
                ctx.db.chapter.findMany({
                    where,
                    include: {
                        subject: {
                            select: {
                                name: true,
                            },
                        }
                    },
                    orderBy: {
                        position: sort === "asc" ? "asc" : "desc",
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                ctx.db.chapter.count({
                    where,
                }),
            ]);

            return {
                chapters,
                totalCount,
            };
        }),
});