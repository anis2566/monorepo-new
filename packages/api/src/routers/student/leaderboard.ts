import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { z } from "zod";

export const leaderboardRouter = {
  // Get overall leaderboard
  getOverall: studentProcedure
    .input(
      z.object({
        classNameId: z.string().optional(),
        batchId: z.string().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          classNameId: true,
          batchId: true,
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student profile not found",
        });
      }

      // Use student's class/batch if not specified
      const classNameId = input.classNameId || student.classNameId;
      const batchId = input.batchId || student.batchId;

      // Get all completed attempts for students in the same class/batch
      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          status: { in: ["Submitted", "Auto-Submitted"] },
          student: {
            classNameId: classNameId,
            ...(batchId && { batchId }),
          },
        },
        include: {
          student: {
            select: {
              id: true,
              studentId: true,
              name: true,
              imageUrl: true,
              className: {
                select: { name: true },
              },
              batch: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Aggregate stats by student
      const studentStats = new Map<
        string,
        {
          studentId: string;
          studentName: string;
          imageUrl: string | null;
          className: string;
          batch: string | null;
          totalScore: number;
          totalExams: number;
          correctAnswers: number;
          totalQuestions: number;
          bestStreak: number;
          totalXp: number;
        }
      >();

      attempts.forEach((attempt) => {
        const key = attempt.studentId;
        const existing = studentStats.get(key);

        if (existing) {
          existing.totalScore += attempt.score;
          existing.totalExams += 1;
          existing.correctAnswers += attempt.correctAnswers;
          existing.totalQuestions += attempt.totalQuestions;
          existing.bestStreak = Math.max(
            existing.bestStreak,
            attempt.bestStreak
          );
          existing.totalXp += Math.round(attempt.score * 10); // 10 XP per point
        } else {
          studentStats.set(key, {
            studentId: attempt.student.studentId,
            studentName: attempt.student.name,
            imageUrl: attempt.student.imageUrl,
            className: attempt.student.className.name,
            batch: attempt.student.batch?.name || null,
            totalScore: attempt.score,
            totalExams: 1,
            correctAnswers: attempt.correctAnswers,
            totalQuestions: attempt.totalQuestions,
            bestStreak: attempt.bestStreak,
            totalXp: Math.round(attempt.score * 10),
          });
        }
      });

      // Convert to array and calculate averages
      const leaderboard = Array.from(studentStats.values())
        .map((stats) => ({
          ...stats,
          averagePercentage:
            stats.totalQuestions > 0
              ? (stats.correctAnswers / stats.totalQuestions) * 100
              : 0,
        }))
        .sort((a, b) => {
          // Sort by total score, then by average percentage
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          return b.averagePercentage - a.averagePercentage;
        })
        .slice(0, input.limit)
        .map((entry, index) => ({
          id: entry.studentId,
          rank: index + 1,
          studentId: entry.studentId,
          studentName: entry.studentName,
          imageUrl: entry.imageUrl,
          className: entry.className,
          batch: entry.batch,
          totalScore: entry.totalScore,
          totalExams: entry.totalExams,
          averagePercentage: entry.averagePercentage,
          bestStreak: entry.bestStreak,
          totalXp: entry.totalXp,
          correctAnswers: entry.correctAnswers,
        }));

      console.log(leaderboard);

      return leaderboard;
    }),

  // Get weekly leaderboard
  getWeekly: studentProcedure
    .input(
      z.object({
        classNameId: z.string().optional(),
        batchId: z.string().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          classNameId: true,
          batchId: true,
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student profile not found",
        });
      }

      const classNameId = input.classNameId || student.classNameId;
      const batchId = input.batchId || student.batchId;

      // Get date 7 days ago
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          status: { in: ["Submitted", "Auto-Submitted"] },
          createdAt: { gte: weekAgo },
          student: {
            classNameId: classNameId,
            ...(batchId && { batchId }),
          },
        },
        include: {
          student: {
            select: {
              id: true,
              studentId: true,
              name: true,
              imageUrl: true,
              className: {
                select: { name: true },
              },
              batch: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Same aggregation logic
      const studentStats = new Map<string, any>();

      attempts.forEach((attempt) => {
        const key = attempt.studentId;
        const existing = studentStats.get(key);

        if (existing) {
          existing.totalScore += attempt.score;
          existing.totalExams += 1;
          existing.correctAnswers += attempt.correctAnswers;
          existing.totalQuestions += attempt.totalQuestions;
          existing.bestStreak = Math.max(
            existing.bestStreak,
            attempt.bestStreak
          );
          existing.totalXp += Math.round(attempt.score * 10);
        } else {
          studentStats.set(key, {
            studentId: attempt.student.studentId,
            studentName: attempt.student.name,
            imageUrl: attempt.student.imageUrl,
            className: attempt.student.className.name,
            batch: attempt.student.batch?.name || null,
            totalScore: attempt.score,
            totalExams: 1,
            correctAnswers: attempt.correctAnswers,
            totalQuestions: attempt.totalQuestions,
            bestStreak: attempt.bestStreak,
            totalXp: Math.round(attempt.score * 10),
          });
        }
      });

      const leaderboard = Array.from(studentStats.values())
        .map((stats) => ({
          ...stats,
          averagePercentage:
            stats.totalQuestions > 0
              ? (stats.correctAnswers / stats.totalQuestions) * 100
              : 0,
        }))
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          return b.averagePercentage - a.averagePercentage;
        })
        .slice(0, input.limit)
        .map((entry, index) => ({
          id: entry.studentId,
          rank: index + 1,
          studentId: entry.studentId,
          studentName: entry.studentName,
          imageUrl: entry.imageUrl,
          className: entry.className,
          batch: entry.batch,
          totalScore: entry.totalScore,
          totalExams: entry.totalExams,
          averagePercentage: entry.averagePercentage,
          bestStreak: entry.bestStreak,
          totalXp: entry.totalXp,
          correctAnswers: entry.correctAnswers,
        }));

      return leaderboard;
    }),

  // Get streak leaderboard (sorted by best streak)
  getStreak: studentProcedure
    .input(
      z.object({
        classNameId: z.string().optional(),
        batchId: z.string().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findUnique({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          classNameId: true,
          batchId: true,
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student profile not found",
        });
      }

      const classNameId = input.classNameId || student.classNameId;
      const batchId = input.batchId || student.batchId;

      const attempts = await ctx.db.examAttempt.findMany({
        where: {
          status: { in: ["Submitted", "Auto-Submitted"] },
          student: {
            classNameId: classNameId,
            ...(batchId && { batchId }),
          },
        },
        include: {
          student: {
            select: {
              id: true,
              studentId: true,
              name: true,
              imageUrl: true,
              className: {
                select: { name: true },
              },
              batch: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          bestStreak: "desc", // ✅ Index on bestStreak
        },
      });

      const studentStats = new Map<string, any>();

      attempts.forEach((attempt) => {
        const key = attempt.studentId;
        const existing = studentStats.get(key);

        if (existing) {
          existing.totalScore += attempt.score;
          existing.totalExams += 1;
          existing.correctAnswers += attempt.correctAnswers;
          existing.totalQuestions += attempt.totalQuestions;
          existing.bestStreak = Math.max(
            existing.bestStreak,
            attempt.bestStreak
          );
          existing.totalXp += Math.round(attempt.score * 10);
        } else {
          studentStats.set(key, {
            studentId: attempt.student.studentId,
            studentName: attempt.student.name,
            imageUrl: attempt.student.imageUrl,
            className: attempt.student.className.name,
            batch: attempt.student.batch?.name || null,
            totalScore: attempt.score,
            totalExams: 1,
            correctAnswers: attempt.correctAnswers,
            totalQuestions: attempt.totalQuestions,
            bestStreak: attempt.bestStreak,
            totalXp: Math.round(attempt.score * 10),
          });
        }
      });

      // Sort by best streak
      const leaderboard = Array.from(studentStats.values())
        .map((stats) => ({
          ...stats,
          averagePercentage:
            stats.totalQuestions > 0
              ? (stats.correctAnswers / stats.totalQuestions) * 100
              : 0,
        }))
        .sort((a, b) => {
          // Sort by best streak first
          if (b.bestStreak !== a.bestStreak) {
            return b.bestStreak - a.bestStreak;
          }
          // Then by total score
          return b.totalScore - a.totalScore;
        })
        .slice(0, input.limit)
        .map((entry, index) => ({
          id: entry.studentId,
          rank: index + 1,
          studentId: entry.studentId,
          studentName: entry.studentName,
          imageUrl: entry.imageUrl,
          className: entry.className,
          batch: entry.batch,
          totalScore: entry.totalScore,
          totalExams: entry.totalExams,
          averagePercentage: entry.averagePercentage,
          bestStreak: entry.bestStreak,
          totalXp: entry.totalXp,
          correctAnswers: entry.correctAnswers,
        }));

      return leaderboard;
    }),

  // Get current user's rank
  getUserRank: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        studentId: true,
        name: true,
        imageUrl: true,
        classNameId: true,
        batchId: true,
        className: {
          select: { name: true },
        },
        batch: {
          select: { name: true },
        },
      },
    });

    if (!student) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Student profile not found",
      });
    }

    // Get user's attempts
    const userAttempts = await ctx.db.examAttempt.findMany({
      where: {
        studentId: student.id,
        status: { in: ["Submitted", "Auto-Submitted"] },
      },
    });

    // Calculate user's stats
    let totalScore = 0;
    let totalExams = userAttempts.length;
    let correctAnswers = 0;
    let totalQuestions = 0;
    let bestStreak = 0;
    let totalXp = 0;

    userAttempts.forEach((attempt) => {
      totalScore += attempt.score;
      correctAnswers += attempt.correctAnswers;
      totalQuestions += attempt.totalQuestions;
      bestStreak = Math.max(bestStreak, attempt.bestStreak);
      totalXp += Math.round(attempt.score * 10);
    });

    const averagePercentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Get rank by counting students with higher scores
    const higherScoreCount = await ctx.db.examAttempt.groupBy({
      by: ["studentId"],
      where: {
        status: { in: ["Submitted", "Auto-Submitted"] },
        student: {
          classNameId: student.classNameId,
          ...(student.batchId && { batchId: student.batchId }),
        },
      },
      _sum: {
        score: true,
      },
      having: {
        score: {
          _sum: {
            gt: totalScore,
          },
        },
      },
    });

    const rank = higherScoreCount.length + 1;

    return {
      id: student.studentId,
      rank,
      studentId: student.studentId,
      studentName: student.name,
      imageUrl: student.imageUrl,
      className: student.className.name,
      batch: student.batch?.name || null,
      totalScore,
      totalExams,
      averagePercentage,
      bestStreak,
      totalXp,
      correctAnswers,
      previousRank: rank, // Would need to track this separately
    };
  }),
} satisfies TRPCRouterRecord;
