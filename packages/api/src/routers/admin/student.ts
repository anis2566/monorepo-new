import z from "zod";

import type { TRPCRouterRecord } from "@trpc/server";
import { StudentSchema } from "@workspace/schema";
import { Prisma } from "@workspace/db";
import { adminProcedure } from "../../trpc";
import { STUDENT_STATUS } from "@workspace/utils/constant";

// Shared error handler
const handleError = (error: unknown, operation: string) => {
  console.error(`Error ${operation}:`, error);
  if (error instanceof Error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
  return { success: false, message: "Internal Server Error" };
};

export const studentRouter = {
  createOne: adminProcedure
    .input(StudentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const existingStudent = await ctx.db.student.findFirst({
          where: {
            classNameId: input.classNameId,
            studentId: input.studentId,
          },
          select: { id: true },
        });

        if (existingStudent) {
          return {
            success: false,
            message: "Student with this ID already exists",
          };
        }

        await ctx.db.student.create({
          data: {
            ...input,
            dob: new Date(input.dob),
            shift: input.shift || "",
            batchId: input.batchId || null,
            studentStatus: {
              create: {
                status: STUDENT_STATUS.Present,
              },
            },
          },
        });

        return { success: true, message: "Admission successful" };
      } catch (error) {
        return handleError(error, "creating admission");
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        ...StudentSchema.shape,
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;

      try {
        const existingStudent = await ctx.db.student.findUnique({
          where: { id },
        });

        if (!existingStudent) {
          return { success: false, message: "Student not found" };
        }

        await ctx.db.student.update({
          where: { id },
          data: {
            ...rest,
            dob: new Date(input.dob),
          },
        });

        return { success: true, message: "Student updated successfully" };
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return { success: false, message: "Student not found" };
        }
        return handleError(error, "updating student");
      }
    }),

  deleteOne: adminProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        const existingStudent = await ctx.db.student.findUnique({
          where: { id: input },
        });

        if (!existingStudent) {
          return { success: false, message: "Student not found" };
        }

        await ctx.db.student.delete({
          where: { id: input },
        });

        return { success: true, message: "Student deleted successfully" };
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return { success: false, message: "Student not found" };
        }
        return handleError(error, "deleting student");
      }
    }),

  getOne: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: { id: input },
      include: {
        className: {
          select: {
            name: true,
            id: true,
          },
        },
        institute: {
          select: {
            name: true,
            id: true,
          },
        },
        batch: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }),

  // Add this to your student router
  getPendingVerifications: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(3),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 3;

      const pendingStudents = await ctx.db.user.findMany({
        where: {
          isVerifiedStudent: false,
        },
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          student: {
            select: {
              studentId: true,
              className: {
                select: {
                  name: true,
                },
              },
              institute: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return pendingStudents.map((user) => ({
        id: user.id,
        name: user.name || "Unknown",
        imageUrl: user.image || undefined,
        studentId: user.student?.studentId || "",
        className: user.student?.className.name || "",
        institute: user.student?.institute.name || "",
        submittedAt: user.createdAt,
      }));
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        classNameId: z.string().nullish(),
        batchId: z.string().nullish(),
        id: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, sort, search, classNameId, batchId, id } = input;

      const where: Prisma.StudentWhereInput = {
        ...(search && { name: { contains: search, mode: "insensitive" } }),
        ...(classNameId &&
          classNameId !== "All" && { classNameId: { equals: classNameId } }),
        ...(batchId && batchId !== "All" && { batchId: { equals: batchId } }),
        ...(id && { id: { equals: id } }),
      };

      let orderBy: Prisma.StudentOrderByWithRelationInput = {
        createdAt: "desc",
      };

      if (sort) {
        if (sort === "id_asc") {
          orderBy = { studentId: "asc" };
        } else if (sort === "id_desc") {
          orderBy = { studentId: "desc" };
        } else if (sort === "asc") {
          orderBy = { createdAt: "asc" };
        } else if (sort === "desc") {
          orderBy = { createdAt: "desc" };
        }
      }

      const [students, totalCount] = await Promise.all([
        ctx.db.student.findMany({
          where,
          include: {
            className: {
              select: {
                name: true,
              },
            },
            institute: {
              select: {
                name: true,
              },
            },
            batch: {
              select: {
                name: true,
              },
            },
          },
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.student.count({ where }),
      ]);

      return {
        students,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
