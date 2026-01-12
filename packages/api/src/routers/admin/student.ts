import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
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

  getStudentDetails: adminProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { studentId } = input;

      const student = await ctx.db.student.findUnique({
        where: { id: studentId },
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
          studentStatus: {
            select: {
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
              isVerifiedStudent: true,
            },
          },
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      return {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        nameBangla: student.nameBangla,
        imageUrl: student.imageUrl,
        fName: student.fName,
        mName: student.mName,
        gender: student.gender,
        dob: student.dob.toISOString(),
        nationality: student.nationality,
        religion: student.religion,
        section: student.section,
        shift: student.shift,
        group: student.group,
        roll: student.roll,
        fPhone: student.fPhone,
        mPhone: student.mPhone,
        presentAddress: {
          houseNo: student.presentHouseNo,
          moholla: student.presentMoholla,
          post: student.presentPost,
          thana: student.presentThana,
        },
        permanentAddress: {
          village: student.permanentVillage,
          post: student.permanentPost,
          thana: student.permanentThana,
          district: student.permanentDistrict,
        },
        className: student.className.name,
        institute: student.institute.name,
        batch: student.batch?.name || null,
        studentStatus: {
          status: student.studentStatus?.status,
        },
        linkedUser: student.user
          ? {
              id: student.user.id,
              email: student.user.email,
              emailVerified: student.user.emailVerified,
              isVerifiedStudent: student.user.isVerifiedStudent,
            }
          : null,
        createdAt: student.createdAt.toISOString(),
        updatedAt: student.updatedAt.toISOString(),
      };
    }),

  getStudentStats: adminProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { studentId } = input;

      const [student, attempts] = await Promise.all([
        ctx.db.student.findUnique({
          where: { id: studentId },
          select: { id: true },
        }),
        ctx.db.examAttempt.findMany({
          where: {
            studentId,
            status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
          },
          select: {
            score: true,
            correctAnswers: true,
            wrongAnswers: true,
            skippedQuestions: true,
            duration: true,
            bestStreak: true,
            exam: {
              select: {
                total: true,
              },
            },
          },
        }),
      ]);

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      const totalExams = attempts.length;

      if (totalExams === 0) {
        return {
          totalExams: 0,
          avgScore: 0,
          passRate: 0,
          bestScore: 0,
          totalTime: 0,
          avgTime: 0,
          totalCorrect: 0,
          totalWrong: 0,
          totalSkipped: 0,
          bestStreak: 0,
        };
      }

      const percentages = attempts.map((a) => (a.score / a.exam.total) * 100);
      const avgScore = percentages.reduce((sum, p) => sum + p, 0) / totalExams;
      const passed = percentages.filter((p) => p >= 40).length;
      const passRate = (passed / totalExams) * 100;
      const bestScore = Math.max(...percentages);
      const totalTime = attempts.reduce((sum, a) => sum + (a.duration || 0), 0);
      const avgTime = totalTime / totalExams;
      const totalCorrect = attempts.reduce(
        (sum, a) => sum + a.correctAnswers,
        0
      );
      const totalWrong = attempts.reduce((sum, a) => sum + a.wrongAnswers, 0);
      const totalSkipped = attempts.reduce(
        (sum, a) => sum + a.skippedQuestions,
        0
      );
      const bestStreak = Math.max(...attempts.map((a) => a.bestStreak));

      return {
        totalExams,
        avgScore: parseFloat(avgScore.toFixed(1)),
        passRate: parseFloat(passRate.toFixed(1)),
        bestScore: parseFloat(bestScore.toFixed(1)),
        totalTime: Math.round(totalTime / 60),
        avgTime: Math.round(avgTime / 60),
        totalCorrect,
        totalWrong,
        totalSkipped,
        bestStreak,
      };
    }),

  getStudentExamHistory: adminProcedure
    .input(
      z.object({
        studentId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { studentId, page, limit } = input;

      const [attempts, totalCount] = await Promise.all([
        ctx.db.examAttempt.findMany({
          where: { studentId },
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                type: true,
                total: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.db.examAttempt.count({ where: { studentId } }),
      ]);

      // Calculate merit rank for each attempt
      const attemptsWithRank = await Promise.all(
        attempts.map(async (attempt) => {
          // Get all submitted attempts for this exam, sorted by score
          const allAttempts = await ctx.db.examAttempt.findMany({
            where: {
              examId: attempt.examId,
              status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            },
            select: {
              id: true,
              score: true,
            },
            orderBy: {
              score: "desc",
            },
          });

          // Find the rank (position in sorted list)
          const rank = allAttempts.findIndex((a) => a.id === attempt.id) + 1;
          const totalParticipants = allAttempts.length;

          return {
            id: attempt.id,
            examId: attempt.exam.id,
            examTitle: attempt.exam.title,
            examType: attempt.exam.type,
            score: attempt.score,
            totalQuestions: attempt.exam.total,
            percentage: parseFloat(
              ((attempt.score / attempt.exam.total) * 100).toFixed(1)
            ),
            correctAnswers: attempt.correctAnswers,
            wrongAnswers: attempt.wrongAnswers,
            skippedQuestions: attempt.skippedQuestions,
            duration: Math.round((attempt.duration || 0) / 60), // Convert to minutes
            status: attempt.status,
            submissionType: attempt.submissionType,
            startTime: attempt.startTime?.toISOString() || null,
            endTime: attempt.endTime?.toISOString() || null,
            createdAt: attempt.createdAt.toISOString(),
            // Merit rank data
            meritRank: rank > 0 ? rank : null,
            totalParticipants,
          };
        })
      );

      return {
        attempts: attemptsWithRank,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  getStudentPerformanceData: adminProcedure
    .input(
      z.object({
        studentId: z.string(),
        months: z.number().min(3).max(12).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const { studentId, months } = input;

      const now = new Date();
      const performanceData = [];

      for (let i = months - 1; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const attempts = await ctx.db.examAttempt.findMany({
          where: {
            studentId,
            status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            score: true,
            exam: {
              select: {
                total: true,
              },
            },
          },
        });

        const avgScore =
          attempts.length > 0
            ? attempts.reduce(
                (sum, a) => sum + (a.score / a.exam.total) * 100,
                0
              ) / attempts.length
            : 0;

        performanceData.push({
          month: startDate.toLocaleString("default", { month: "short" }),
          score: parseFloat(avgScore.toFixed(1)),
          attempts: attempts.length,
        });
      }

      return performanceData;
    }),

  getAnswerDistribution: adminProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { studentId } = input;

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          studentId,
          status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
        },
        select: {
          correctAnswers: true,
          wrongAnswers: true,
          skippedQuestions: true,
        },
      });

      const totalCorrect = attempts.reduce(
        (sum, a) => sum + a.correctAnswers,
        0
      );
      const totalWrong = attempts.reduce((sum, a) => sum + a.wrongAnswers, 0);
      const totalSkipped = attempts.reduce(
        (sum, a) => sum + a.skippedQuestions,
        0
      );

      return [
        { name: "Correct", value: totalCorrect, color: "#10b981" },
        { name: "Wrong", value: totalWrong, color: "#ef4444" },
        { name: "Skipped", value: totalSkipped, color: "#94a3b8" },
      ];
    }),

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
