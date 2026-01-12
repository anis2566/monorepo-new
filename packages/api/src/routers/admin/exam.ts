import z from "zod";

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure, protectedProcedure } from "../../trpc";
import { ExamSchema } from "@workspace/schema";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const examRouter = {
  createOne: adminProcedure
    .input(ExamSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        title,
        startDate,
        endDate,
        duration,
        cq,
        mcq,
        classNameIds,
        batchIds,
        subjectIds,
        hasSuffle,
        hasRandom,
        hasNegativeMark,
        negativeMark,
        type,
        chapterIds,
      } = input;

      try {
        const numberCq = cq ? parseInt(cq) : 0;
        const numberMcq = mcq ? parseInt(mcq) : 0;
        const total = numberCq + numberMcq;

        const batches = await ctx.db.batch.findMany({
          where: {
            id: {
              in: batchIds,
            },
          },
          include: {
            students: {
              select: {
                id: true,
              },
            },
          },
        });

        if (batches.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Batch not found",
          });
        }

        const students = batches.flatMap((batch) => batch.students);

        const examStatus =
          new Date() < new Date(startDate)
            ? EXAM_STATUS.Upcoming
            : EXAM_STATUS.Ongoing;

        const newExam = await ctx.db.exam.create({
          data: {
            title,
            total,
            cq: numberCq,
            mcq: numberMcq,
            duration: parseInt(duration),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            hasSuffle,
            hasRandom,
            type,
            hasNegativeMark,
            ...(negativeMark && { negativeMark: parseFloat(negativeMark) }),
            status: examStatus,
          },
          select: {
            id: true,
            startDate: true,
          },
        });

        await ctx.db.$transaction(
          async (tx) => {
            for (const batch of batches) {
              await tx.examBatch.create({
                data: {
                  examId: newExam.id,
                  batchId: batch.id,
                },
              });
            }
            for (const className of classNameIds) {
              await tx.examClassName.create({
                data: {
                  examId: newExam.id,
                  classNameId: className,
                },
              });
            }
            for (const subject of subjectIds) {
              await tx.examSubject.create({
                data: {
                  examId: newExam.id,
                  subjectId: subject,
                },
              });
            }
            for (const student of students) {
              await tx.examStudent.create({
                data: {
                  examId: newExam.id,
                  studentId: student.id,
                },
              });
            }
            for (const chapter of chapterIds || []) {
              await tx.examChapter.create({
                data: {
                  examId: newExam.id,
                  chapterId: chapter,
                },
              });
            }
          },
          {
            timeout: 60000,
            maxWait: 60000,
          }
        );

        return { success: true, message: "Exam created", newExam };
      } catch (error) {
        console.error("Error creating exam:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create exam",
        });
      }
    }),

  updateOne: adminProcedure
    .input(
      z.object({
        data: ExamSchema,
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      try {
        const existingExam = await ctx.db.exam.findFirst({
          where: {
            id,
          },
        });

        if (!existingExam) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exam not found",
          });
        }

        const numberCq = data.cq ? parseInt(data.cq) : 0;
        const numberMcq = data.mcq ? parseInt(data.mcq) : 0;
        const total = numberCq + numberMcq;

        // Fetch all batches with their students
        const batches = await ctx.db.batch.findMany({
          where: {
            id: {
              in: data.batchIds,
            },
          },
          include: {
            students: {
              select: {
                id: true,
              },
            },
          },
        });

        if (batches.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Batch not found",
          });
        }

        const students = batches.flatMap((batch) => batch.students);

        await ctx.db.$transaction(
          async (tx) => {
            // Update the exam
            await tx.exam.update({
              where: {
                id,
              },
              data: {
                title: data.title,
                total,
                cq: numberCq,
                mcq: numberMcq,
                type: data.type,
                duration: parseInt(data.duration),
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                hasSuffle: data.hasSuffle,
                hasRandom: data.hasRandom,
                hasNegativeMark: data.hasNegativeMark,
                ...(data.negativeMark && {
                  negativeMark: parseFloat(data.negativeMark),
                }),
              },
            });

            // Delete existing relations
            await tx.examBatch.deleteMany({
              where: { examId: id },
            });
            await tx.examClassName.deleteMany({
              where: { examId: id },
            });
            await tx.examSubject.deleteMany({
              where: { examId: id },
            });
            await tx.examStudent.deleteMany({
              where: { examId: id },
            });
            await tx.examChapter.deleteMany({
              where: { examId: id },
            });

            // Create new relations
            for (const batch of batches) {
              await tx.examBatch.create({
                data: {
                  examId: id,
                  batchId: batch.id,
                },
              });
            }
            for (const className of data.classNameIds) {
              await tx.examClassName.create({
                data: {
                  examId: id,
                  classNameId: className,
                },
              });
            }
            for (const subject of data.subjectIds) {
              await tx.examSubject.create({
                data: {
                  examId: id,
                  subjectId: subject,
                },
              });
            }
            for (const student of students) {
              await tx.examStudent.create({
                data: {
                  examId: id,
                  studentId: student.id,
                },
              });
            }
            for (const chapter of data.chapterIds || []) {
              await tx.examChapter.create({
                data: {
                  examId: id,
                  chapterId: chapter,
                },
              });
            }
          },
          {
            timeout: 60000,
            maxWait: 60000,
          }
        );

        return { success: true, message: "Exam updated" };
      } catch (error) {
        console.error("Error updating exam:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update exam",
        });
      }
    }),

  forSelect: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const exams = await ctx.db.exam.findMany({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      return exams;
    }),

  deleteOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const existingExam = await ctx.db.exam.findFirst({
          where: {
            id,
          },
        });

        if (!existingExam) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exam not found",
          });
        }

        await ctx.db.$transaction(async (tx) => {
          // Delete all related records first
          await tx.examBatch.deleteMany({
            where: { examId: id },
          });
          await tx.examClassName.deleteMany({
            where: { examId: id },
          });
          await tx.examSubject.deleteMany({
            where: { examId: id },
          });
          await tx.examStudent.deleteMany({
            where: { examId: id },
          });

          // Delete the exam
          await tx.exam.delete({
            where: {
              id,
            },
          });
        });

        return { success: true, message: "Exam deleted" };
      } catch (error) {
        console.error("Error deleting exam:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete exam",
        });
      }
    }),

  getOne: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const examId = input;

    const examData = await ctx.db.exam.findUnique({
      where: { id: examId },
      include: {
        classNames: {
          select: {
            className: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        batches: {
          select: {
            batch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subjects: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        chapters: {
          select: {
            chapter: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!examData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Exam not found",
      });
    }

    // Transform the data to match the form schema
    const transformedData = {
      ...examData,
      classNameIds: examData.classNames.map((cn) => cn.className.id),
      batchIds: examData.batches.map((b) => b.batch.id),
      subjectIds: examData.subjects.map((s) => s.subject.id),
      chapterIds: examData.chapters.map((c) => c.chapter.id),
      // Convert dates and numbers to strings for form compatibility
      startDate: examData.startDate.toISOString(),
      endDate: examData.endDate.toISOString(),
      duration: examData.duration.toString(),
      cq: examData.cq?.toString() || "",
      mcq: examData.mcq?.toString() || "",
      negativeMark: examData.negativeMark?.toString() || "",
    };

    return { success: true, data: transformedData };
  }),

  getExamDetails: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const exam = await ctx.db.exam.findUnique({
        where: { id: examId },
        include: {
          classNames: {
            select: {
              className: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          batches: {
            select: {
              batch: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          subjects: {
            select: {
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          chapters: {
            select: {
              chapter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      return {
        id: exam.id,
        title: exam.title,
        type: exam.type,
        status: exam.status,
        duration: exam.duration,
        total: exam.total,
        cq: exam.cq,
        mcq: exam.mcq,
        startDate: exam.startDate.toISOString(),
        endDate: exam.endDate.toISOString(),
        hasNegativeMark: exam.hasNegativeMark,
        negativeMark: exam.negativeMark,
        hasShuffle: exam.hasSuffle, // Note: typo in schema
        hasRandom: exam.hasRandom,
        classes: exam.classNames.map((cn) => cn.className.name),
        batches: exam.batches.map((b) => b.batch.name),
        subjects: exam.subjects.map((s) => s.subject.name),
        chapters: exam.chapters.map((c) => c.chapter.name),
        createdAt: exam.createdAt.toISOString(),
        updatedAt: exam.updatedAt.toISOString(),
      };
    }),

  getExamStats: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const [exam, attempts] = await Promise.all([
        ctx.db.exam.findUnique({
          where: { id: examId },
          select: { id: true, total: true },
        }),
        ctx.db.examAttempt.findMany({
          where: { examId },
          select: {
            id: true,
            status: true,
            score: true,
            duration: true,
            tabSwitches: true,
            submissionType: true,
            totalQuestions: true,
          },
        }),
      ]);

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      const completedAttempts = attempts.filter((a) =>
        ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"].includes(a.status)
      );
      const inProgress = attempts.filter(
        (a) => a.status === "In Progress"
      ).length;

      // Calculate scores based on totalQuestions from each attempt
      const scores = completedAttempts.map(
        (a) => (a.score / a.totalQuestions) * 100
      );

      const avgScore =
        scores.length > 0
          ? scores.reduce((sum, s) => sum + s, 0) / scores.length
          : 0;
      const passed = scores.filter((s) => s >= 40).length;
      const passRate = scores.length > 0 ? (passed / scores.length) * 100 : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

      const durations = completedAttempts
        .filter((a) => a.duration)
        .map((a) => a.duration!);
      const avgDuration =
        durations.length > 0
          ? durations.reduce((sum, d) => sum + d, 0) / durations.length
          : 0;

      const tabSwitchViolations = attempts.reduce(
        (sum, a) => sum + a.tabSwitches,
        0
      );

      return {
        totalAttempts: attempts.length,
        completedAttempts: completedAttempts.length,
        inProgress,
        avgScore: parseFloat(avgScore.toFixed(1)),
        passRate: parseFloat(passRate.toFixed(1)),
        highestScore: parseFloat(highestScore.toFixed(1)),
        lowestScore: parseFloat(lowestScore.toFixed(1)),
        avgDuration: Math.round(avgDuration / 60), // Convert to minutes
        tabSwitchViolations,
      };
    }),

  getExamAttempts: adminProcedure
    .input(
      z.object({
        examId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { examId, page, limit } = input;

      const [attempts, totalCount] = await Promise.all([
        ctx.db.examAttempt.findMany({
          where: { examId },
          include: {
            student: {
              select: {
                id: true,
                studentId: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.db.examAttempt.count({ where: { examId } }),
      ]);

      return {
        attempts: attempts.map((attempt) => ({
          id: attempt.id,
          studentId: attempt.student.studentId,
          studentName: attempt.student.name,
          status: attempt.status,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          percentage: parseFloat(
            ((attempt.score / attempt.totalQuestions) * 100).toFixed(1)
          ),
          correctAnswers: attempt.correctAnswers,
          wrongAnswers: attempt.wrongAnswers,
          skippedQuestions: attempt.skippedQuestions,
          duration: Math.round((attempt.duration || 0) / 60), // Convert to minutes
          tabSwitches: attempt.tabSwitches,
          submissionType: attempt.submissionType,
          startTime: attempt.startTime?.toISOString() || null,
          endTime: attempt.endTime?.toISOString() || null,
          createdAt: attempt.createdAt.toISOString(),
        })),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  getExamMcqs: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const examMcqs = await ctx.db.examMcq.findMany({
        where: { examId },
        include: {
          mcq: {
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
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return examMcqs.map((examMcq, index) => ({
        id: examMcq.mcq.id,
        question: examMcq.mcq.question,
        options: examMcq.mcq.options,
        statements: examMcq.mcq.statements,
        answer: examMcq.mcq.answer,
        type: examMcq.mcq.type,
        reference: examMcq.mcq.reference,
        explanation: examMcq.mcq.explanation,
        isMath: examMcq.mcq.isMath,
        session: examMcq.mcq.session,
        source: examMcq.mcq.source,
        questionUrl: examMcq.mcq.questionUrl,
        context: examMcq.mcq.context,
        contextUrl: examMcq.mcq.contextUrl,
        subject: examMcq.mcq.subject.name,
        chapter: examMcq.mcq.chapter.name,
        order: index + 1,
      }));
    }),

  getScoreDistribution: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          examId,
          status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
        },
        select: {
          score: true,
          totalQuestions: true,
        },
      });

      const ranges = [
        { range: "0-20%", min: 0, max: 20 },
        { range: "21-40%", min: 21, max: 40 },
        { range: "41-60%", min: 41, max: 60 },
        { range: "61-80%", min: 61, max: 80 },
        { range: "81-100%", min: 81, max: 100 },
      ];

      const distribution = ranges.map((r) => {
        const count = attempts.filter((a) => {
          const percentage = (a.score / a.totalQuestions) * 100;
          return percentage >= r.min && percentage <= r.max;
        }).length;

        return {
          range: r.range,
          count,
        };
      });

      return distribution;
    }),

  getAnswerDistribution: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          examId,
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

  getTimeAnalysis: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const [exam, attempts] = await Promise.all([
        ctx.db.exam.findUnique({
          where: { id: examId },
          select: { duration: true },
        }),
        ctx.db.examAttempt.findMany({
          where: {
            examId,
            status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
            duration: { not: null },
          },
          select: {
            duration: true,
          },
        }),
      ]);

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      const maxDuration = exam.duration * 60; // Convert to seconds
      const ranges = [
        { time: "0-25%", min: 0, max: 0.25 },
        { time: "25-50%", min: 0.25, max: 0.5 },
        { time: "50-75%", min: 0.5, max: 0.75 },
        { time: "75-100%", min: 0.75, max: 1.0 },
      ];

      const analysis = ranges.map((r) => {
        const students = attempts.filter((a) => {
          const percentage = a.duration! / maxDuration;
          return percentage >= r.min && percentage <= r.max;
        }).length;

        return {
          time: r.time,
          students,
        };
      });

      return analysis;
    }),

  getAntiCheatSummary: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const attempts = await ctx.db.examAttempt.findMany({
        where: { examId },
        select: {
          tabSwitches: true,
          submissionType: true,
        },
      });

      const totalTabSwitches = attempts.reduce(
        (sum, a) => sum + a.tabSwitches,
        0
      );
      const studentsWithViolations = attempts.filter(
        (a) => a.tabSwitches > 0
      ).length;
      const autoSubmittedTabSwitch = attempts.filter(
        (a) => a.submissionType === "Auto-TabSwitch"
      ).length;

      return {
        totalTabSwitches,
        studentsWithViolations,
        autoSubmittedTabSwitch,
      };
    }),

  getPerformanceOverview: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          examId,
          status: { in: ["Submitted", "Auto-TimeUp", "Auto-TabSwitch"] },
        },
        select: {
          score: true,
          totalQuestions: true,
          tabSwitches: true,
        },
      });

      if (attempts.length === 0) {
        return {
          highestScore: 0,
          lowestScore: 0,
          avgScore: 0,
          tabSwitchViolations: 0,
        };
      }

      const scores = attempts.map((a) => (a.score / a.totalQuestions) * 100);
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      const tabSwitchViolations = attempts.reduce(
        (sum, a) => sum + a.tabSwitches,
        0
      );

      return {
        highestScore: parseFloat(highestScore.toFixed(1)),
        lowestScore: parseFloat(lowestScore.toFixed(1)),
        avgScore: parseFloat(avgScore.toFixed(1)),
        tabSwitchViolations,
      };
    }),

  getMeritList: adminProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      // Get exam details
      const exam = await ctx.db.exam.findUnique({
        where: { id: examId },
        select: {
          id: true,
          title: true,
          total: true,
          status: true,
        },
      });

      if (!exam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Exam not found",
        });
      }

      // Get all attempts for this exam with student details
      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          examId,
          status: "Submitted",
        },
        select: {
          id: true,
          score: true,
          student: {
            select: {
              id: true,
              studentId: true,
              name: true,
              imageUrl: true,
              roll: true,
              className: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          score: "desc",
        },
      });

      // Calculate percentages and rankings
      const totalAttempts = attempts.length;
      const meritList = attempts.map((attempt, index) => {
        const percentage = (attempt.score / exam.total) * 100;
        const rank = index + 1;

        // Calculate percentile (higher is better)
        // Percentile = (Number of students scoring less than this student / Total students) * 100
        const studentsBelow = totalAttempts - rank;
        const percentile =
          totalAttempts > 1
            ? Math.round((studentsBelow / (totalAttempts - 1)) * 100)
            : 100;

        return {
          id: attempt.id,
          studentId: attempt.student.studentId,
          name: attempt.student.name,
          imageUrl: attempt.student.imageUrl || null,
          className: attempt.student.className.name,
          roll: attempt.student.roll,
          score: attempt.score,
          total: exam.total,
          percentage: parseFloat(percentage.toFixed(2)),
          rank,
          percentile,
          examId: exam.id,
        };
      });

      // Calculate average score
      const avgScore =
        meritList.length > 0
          ? meritList.reduce((sum, m) => sum + m.percentage, 0) /
            meritList.length
          : 0;

      return {
        exam: {
          id: exam.id,
          title: exam.title,
          total: exam.total,
          status: exam.status,
          avgScore: parseFloat(avgScore.toFixed(1)),
          totalStudents: meritList.length,
        },
        meritList,
      };
    }),

  getMany: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        classNameId: z.string().nullish(),
        batchId: z.string().nullish(),
        subjectId: z.string().nullish(),
        status: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        sort,
        search,
        classNameId,
        batchId,
        subjectId,
        status,
      } = input;

      const [
        exams,
        totalCount,
        totalExam,
        activeExam,
        upcomingExam,
        completedExam,
      ] = await Promise.all([
        ctx.db.exam.findMany({
          where: {
            ...(search && {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }),
            ...(classNameId &&
              classNameId !== "All" && {
                classNames: {
                  some: {
                    classNameId,
                  },
                },
              }),
            ...(batchId &&
              batchId !== "All" && {
                batches: {
                  some: {
                    batchId,
                  },
                },
              }),
            ...(subjectId &&
              subjectId !== "All" && {
                subjects: {
                  some: {
                    subjectId,
                  },
                },
              }),
            ...(status && status !== "All" && { status }),
          },
          include: {
            classNames: {
              select: {
                className: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            batches: {
              select: {
                batch: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            subjects: {
              select: {
                subject: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                students: true,
                attempts: true,
                batches: true,
                classNames: true,
                subjects: true,
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.exam.count({
          where: {
            ...(search && {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }),
            ...(classNameId &&
              classNameId !== "All" && {
                classNames: {
                  some: {
                    classNameId,
                  },
                },
              }),
            ...(batchId &&
              batchId !== "All" && {
                batches: {
                  some: {
                    batchId,
                  },
                },
              }),
            ...(subjectId &&
              subjectId !== "All" && {
                subjects: {
                  some: {
                    subjectId,
                  },
                },
              }),
            ...(status && status !== "All" && { status }),
          },
        }),
        ctx.db.exam.count(),
        ctx.db.exam.count({
          where: {
            status: EXAM_STATUS.Ongoing,
          },
        }),
        ctx.db.exam.count({
          where: {
            status: EXAM_STATUS.Upcoming,
          },
        }),
        ctx.db.exam.count({
          where: {
            status: EXAM_STATUS.Completed,
          },
        }),
      ]);

      return {
        exams,
        totalCount,
        totalExam,
        activeExam,
        upcomingExam,
        completedExam,
      };
    }),
} satisfies TRPCRouterRecord;
