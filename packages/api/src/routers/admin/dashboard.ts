import z from "zod";

import { type TRPCRouterRecord } from "@trpc/server";
import { adminProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const dashboardRouter = {
  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      newStudentsThisMonth,
      previousMonthStudents,
      totalExams,
      activeExams,
      ongoingExams,
      totalMcqs,
      totalUsers,
      newUsersThisMonth,
      previousMonthUsers,
      totalAttempts,
      pendingVerifications,
      activeAlerts,
    ] = await Promise.all([
      // Total students
      ctx.db.student.count(),

      // New students this month
      ctx.db.student.count({
        where: {
          createdAt: {
            gte: currentMonth,
          },
        },
      }),

      // Previous month students (for trend calculation)
      ctx.db.student.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),

      // Total exams
      ctx.db.exam.count(),

      // Active exams (ongoing + upcoming)
      ctx.db.exam.count({
        where: {
          status: {
            in: [EXAM_STATUS.Ongoing, EXAM_STATUS.Upcoming],
          },
        },
      }),

      // Ongoing exams
      ctx.db.exam.count({
        where: {
          status: EXAM_STATUS.Ongoing,
        },
      }),

      // Total MCQs
      ctx.db.mcq.count(),

      // Total users
      ctx.db.user.count(),

      // New users this month
      ctx.db.user.count({
        where: {
          createdAt: {
            gte: currentMonth,
          },
        },
      }),

      // Previous month users
      ctx.db.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),

      // Total exam attempts
      ctx.db.examAttempt.count(),

      // Pending student verifications
      ctx.db.user.count({
        where: {
          isVerifiedStudent: false,
          student: {
            isNot: null,
          },
        },
      }),

      // Active alerts (tab switches in last 7 days)
      ctx.db.examAttempt.count({
        where: {
          tabSwitches: {
            gt: 0,
          },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate trends
    const studentTrend =
      previousMonthStudents > 0
        ? ((newStudentsThisMonth - previousMonthStudents) /
            previousMonthStudents) *
          100
        : 0;

    const userTrend =
      previousMonthUsers > 0
        ? ((newUsersThisMonth - previousMonthUsers) / previousMonthUsers) * 100
        : 0;

    // Calculate exam trend (exams created this month vs last month)
    const [examsThisMonth, examsLastMonth] = await Promise.all([
      ctx.db.exam.count({
        where: {
          createdAt: {
            gte: currentMonth,
          },
        },
      }),
      ctx.db.exam.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),
    ]);

    const examTrend =
      examsLastMonth > 0
        ? ((examsThisMonth - examsLastMonth) / examsLastMonth) * 100
        : 0;

    return {
      totalStudents,
      newStudentsThisMonth,
      studentTrend: parseFloat(studentTrend.toFixed(1)),
      activeExams,
      ongoingExams,
      totalExams,
      examTrend: parseFloat(examTrend.toFixed(1)),
      mcqBank: totalMcqs,
      totalUsers,
      userTrend: parseFloat(userTrend.toFixed(1)),
      totalAttempts,
      pendingVerifications,
      activeAlerts,
    };
  }),

  getAttemptStats: adminProcedure.query(async ({ ctx }) => {
    const [totalAttempts, inProgress, completed, autoSubmitted, attempts] =
      await Promise.all([
        ctx.db.examAttempt.count(),
        ctx.db.examAttempt.count({
          where: {
            status: "In Progress",
          },
        }),
        ctx.db.examAttempt.count({
          where: {
            status: "Submitted",
          },
        }),
        ctx.db.examAttempt.count({
          where: {
            submissionType: {
              in: ["Auto-TimeUp", "Auto-TabSwitch"],
            },
          },
        }),
        ctx.db.examAttempt.findMany({
          where: {
            duration: {
              not: null,
            },
          },
          select: {
            duration: true,
            tabSwitches: true,
          },
        }),
      ]);

    // Calculate average duration
    const totalDuration = attempts.reduce(
      (sum, attempt) => sum + (attempt.duration || 0),
      0
    );
    const avgDuration =
      attempts.length > 0
        ? Math.round(totalDuration / attempts.length / 60)
        : 0; // Convert to minutes

    // Count tab switch violations
    const tabSwitchViolations = attempts.filter(
      (a) => a.tabSwitches > 3
    ).length;

    return {
      totalAttempts,
      inProgress,
      completed,
      autoSubmitted,
      avgDuration,
      tabSwitchViolations,
    };
  }),

  getTopPerformers: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(5),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 5;

      // Get students with their attempt statistics
      const students = await ctx.db.student.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          attempts: {
            where: {
              status: "Submitted",
            },
            select: {
              score: true,
              bestStreak: true,
            },
          },
        },
        where: {
          attempts: {
            some: {
              status: "Submitted",
            },
          },
        },
      });

      // Calculate statistics for each student
      const performersWithStats = students
        .map((student) => {
          const attempts = student.attempts;
          const totalAttempts = attempts.length;
          const totalScore = attempts.reduce(
            (sum, attempt) => sum + attempt.score,
            0
          );
          const avgScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
          const bestStreak = Math.max(...attempts.map((a) => a.bestStreak), 0);

          return {
            id: student.id,
            name: student.name,
            imageUrl: student.imageUrl || null,
            avgScore: parseFloat(avgScore.toFixed(1)),
            totalAttempts,
            bestStreak,
          };
        })
        .filter((p) => p.totalAttempts > 0)
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, limit)
        .map((performer, index) => ({
          ...performer,
          rank: index + 1,
        }));

      return performersWithStats;
    }),

  getExamDistribution: adminProcedure.query(async ({ ctx }) => {
    const [upcoming, ongoing, completed] = await Promise.all([
      ctx.db.exam.count({
        where: {
          status: EXAM_STATUS.Upcoming,
        },
      }),
      ctx.db.exam.count({
        where: {
          status: EXAM_STATUS.Ongoing,
        },
      }),
      ctx.db.exam.count({
        where: {
          status: EXAM_STATUS.Completed,
        },
      }),
    ]);

    return {
      upcoming,
      ongoing,
      completed,
    };
  }),

  getSubjectPerformance: adminProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.db.subject.findMany({
      select: {
        id: true,
        name: true,
        exams: {
          select: {
            exam: {
              select: {
                attempts: {
                  where: {
                    status: "Submitted",
                  },
                  select: {
                    score: true,
                    exam: {
                      select: {
                        total: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const subjectStats = await Promise.all(
      subjects.map(async (subject) => {
        // Get all attempts for this subject
        const attempts = subject.exams.flatMap((examSubject) =>
          examSubject.exam.attempts.map((attempt) => ({
            score: attempt.score,
            total: attempt.exam.total,
            percentage: (attempt.score / attempt.exam.total) * 100,
          }))
        );

        const totalAttempts = attempts.length;
        const avgScore =
          totalAttempts > 0
            ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
            : 0;

        // Get attempts from last month for trend
        const lastMonthAttempts = await ctx.db.examAttempt.count({
          where: {
            status: "Submitted",
            createdAt: {
              gte: lastMonth,
              lt: new Date(now.getFullYear(), now.getMonth(), 1),
            },
            exam: {
              subjects: {
                some: {
                  subjectId: subject.id,
                },
              },
            },
          },
        });

        const currentMonthAttempts = await ctx.db.examAttempt.count({
          where: {
            status: "Submitted",
            createdAt: {
              gte: new Date(now.getFullYear(), now.getMonth(), 1),
            },
            exam: {
              subjects: {
                some: {
                  subjectId: subject.id,
                },
              },
            },
          },
        });

        const trend =
          lastMonthAttempts > 0
            ? ((currentMonthAttempts - lastMonthAttempts) / lastMonthAttempts) *
              100
            : 0;

        return {
          id: subject.id,
          name: subject.name,
          avgScore: parseFloat(avgScore.toFixed(1)),
          totalAttempts,
          trend: parseFloat(trend.toFixed(1)),
        };
      })
    );

    return subjectStats
      .filter((s) => s.totalAttempts > 0)
      .sort((a, b) => b.avgScore - a.avgScore);
  }),

  getPerformanceData: adminProcedure
    .input(
      z
        .object({
          months: z.number().min(3).max(12).default(6),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const months = input?.months || 6;
      const now = new Date();
      const performanceData = [];

      for (let i = months - 1; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const [attempts, attemptData] = await Promise.all([
          ctx.db.examAttempt.count({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          }),
          ctx.db.examAttempt.findMany({
            where: {
              status: "Submitted",
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
          }),
        ]);

        const avgScore =
          attemptData.length > 0
            ? attemptData.reduce(
                (sum, a) => sum + (a.score / a.exam.total) * 100,
                0
              ) / attemptData.length
            : 0;

        performanceData.push({
          month: startDate.toLocaleString("default", { month: "short" }),
          attempts,
          avgScore: parseFloat(avgScore.toFixed(1)),
        });
      }

      return performanceData;
    }),

  getRecentActivities: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(10),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10;

      // Get recent activities from different sources
      const [recentExams, recentStudents, recentAttempts, recentMcqs] =
        await Promise.all([
          ctx.db.exam.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              title: true,
              createdAt: true,
            },
          }),
          ctx.db.student.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              className: {
                select: {
                  name: true,
                },
              },
              createdAt: true,
            },
          }),
          ctx.db.examAttempt.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            where: {
              status: "Submitted",
            },
            select: {
              id: true,
              student: {
                select: {
                  name: true,
                },
              },
              exam: {
                select: {
                  title: true,
                },
              },
              createdAt: true,
            },
          }),
          ctx.db.mcq.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              subject: {
                select: {
                  name: true,
                },
              },
              createdAt: true,
            },
          }),
        ]);

      // Combine and format activities
      const activities = [
        ...recentExams.map((exam) => ({
          id: exam.id,
          type: "exam_created" as const,
          description: `New exam '${exam.title}' created`,
          timestamp: exam.createdAt,
        })),
        ...recentStudents.map((student) => ({
          id: student.id,
          type: "student_registered" as const,
          description: `${student.name} registered for ${student.className.name}`,
          timestamp: student.createdAt,
        })),
        ...recentAttempts.map((attempt) => ({
          id: attempt.id,
          type: "exam_submitted" as const,
          description: `${attempt.student.name} completed '${attempt.exam.title}'`,
          timestamp: attempt.createdAt,
        })),
        ...recentMcqs.map((mcq) => ({
          id: mcq.id,
          type: "mcq_added" as const,
          description: `New MCQ added to ${mcq.subject.name}`,
          timestamp: mcq.createdAt,
        })),
      ];

      // Sort by timestamp and limit
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);
    }),

  getRecentExams: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(5),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 5;

      const exams = await ctx.db.exam.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          status: true,
          _count: {
            select: {
              attempts: true,
            },
          },
          attempts: {
            where: {
              status: "Submitted",
            },
            select: {
              score: true,
              exam: {
                select: {
                  total: true,
                },
              },
            },
          },
        },
      });

      return exams.map((exam) => {
        const avgScore =
          exam.attempts.length > 0
            ? exam.attempts.reduce(
                (sum, a) => sum + (a.score / a.exam.total) * 100,
                0
              ) / exam.attempts.length
            : 0;

        return {
          id: exam.id,
          title: exam.title,
          type: exam.type,
          duration: exam.duration,
          status: exam.status as
            | "Pending"
            | "Upcoming"
            | "Ongoing"
            | "Completed",
          attemptCount: exam._count.attempts,
          avgScore: parseFloat(avgScore.toFixed(1)),
        };
      });
    }),
} satisfies TRPCRouterRecord;
