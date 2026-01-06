import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const dashboardRouter = {
  get: studentProcedure.query(async ({ ctx }) => {
    const [
      student,
      availableExam,
      completedExam,
      upcomingExams,
      recentResults,
      performanceStats,
      streakInfo,
    ] = await Promise.all([
      // Student profile
      ctx.db.student.findUniqueOrThrow({
        where: { id: ctx.studentId },
        include: {
          className: { select: { name: true } },
          batch: { select: { name: true } },
        },
      }),

      // Available exams count
      ctx.db.exam.count({
        where: {
          status: { in: [EXAM_STATUS.Upcoming, EXAM_STATUS.Ongoing] },
          students: { some: { studentId: ctx.studentId } },
        },
      }),

      // Completed exams count
      ctx.db.exam.count({
        where: {
          status: { in: [EXAM_STATUS.Completed] },
          students: { some: { studentId: ctx.studentId } },
        },
      }),

      // Upcoming/Ongoing exams
      ctx.db.exam.findMany({
        where: {
          status: { in: [EXAM_STATUS.Upcoming, EXAM_STATUS.Ongoing] },
          students: { some: { studentId: ctx.studentId } },
        },
        include: {
          subjects: {
            select: { subject: { select: { name: true } } },
          },
          _count: { select: { mcqs: true } },
        },
        orderBy: { startDate: "asc" },
        take: 5,
      }),

      // Recent results (last 5)
      ctx.db.examAttempt.findMany({
        where: {
          studentId: ctx.studentId,
          status: { in: ["Submitted", "Auto-Submitted"] },
        },
        include: {
          exam: {
            select: { id: true, title: true, total: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Overall performance stats
      ctx.db.examAttempt.aggregate({
        where: {
          studentId: ctx.studentId,
          status: { in: ["Submitted", "Auto-Submitted"] },
        },
        _avg: {
          score: true,
        },
        _sum: {
          correctAnswers: true,
          wrongAnswers: true,
          skippedQuestions: true,
          totalQuestions: true,
        },
        _max: {
          bestStreak: true,
          score: true,
        },
        _count: true,
      }),

      // Current streak info
      ctx.db.examAttempt.findFirst({
        where: {
          studentId: ctx.studentId,
          status: { in: ["Submitted", "Auto-Submitted"] },
        },
        orderBy: { createdAt: "desc" },
        select: {
          currentStreak: true,
          bestStreak: true,
        },
      }),
    ]);

    // Transform recent results
    const transformedRecentResults = recentResults.map((attempt) => {
      const percentage =
        attempt.totalQuestions > 0
          ? (attempt.score / attempt.totalQuestions) * 100
          : 0;

      const getGrade = (percentage: number) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
      };

      return {
        id: attempt.id,
        examId: attempt.examId,
        examTitle: attempt.exam.title,
        score: attempt.score,
        total: attempt.totalQuestions,
        correct: attempt.correctAnswers,
        incorrect: attempt.wrongAnswers,
        skipped: attempt.skippedQuestions,
        percentage,
        grade: getGrade(percentage),
        timeTaken: attempt.duration ? Math.round(attempt.duration / 60) : 0,
        completedAt: attempt.endTime || attempt.updatedAt,
        status: attempt.status,
        submissionType: attempt.submissionType,
      };
    });

    // Calculate overall stats
    const totalAttempts = performanceStats._count;
    const avgScore = performanceStats._avg.score || 0;
    const totalCorrect = performanceStats._sum.correctAnswers || 0;
    const totalWrong = performanceStats._sum.wrongAnswers || 0;
    const totalSkipped = performanceStats._sum.skippedQuestions || 0;
    const totalQuestions = performanceStats._sum.totalQuestions || 0;
    const overallPercentage =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const bestStreak = performanceStats._max.bestStreak || 0;
    const highestScore = performanceStats._max.score || 0;

    // Calculate accuracy (only answered questions)
    const answeredQuestions = totalCorrect + totalWrong;
    const accuracy =
      answeredQuestions > 0 ? (totalCorrect / answeredQuestions) * 100 : 0;

    // Calculate improvement trend (last 3 vs previous 3)
    let improvementTrend = 0;
    if (transformedRecentResults.length >= 6) {
      const recent3 = transformedRecentResults.slice(0, 3);
      const older3 = transformedRecentResults.slice(3, 6);

      const recentAvg = recent3.reduce((sum, r) => sum + r.percentage, 0) / 3;
      const olderAvg = older3.reduce((sum, r) => sum + r.percentage, 0) / 3;

      improvementTrend = recentAvg - olderAvg;
    } else if (transformedRecentResults.length >= 2) {
      // If we don't have 6, compare first vs last
      const recent = transformedRecentResults[0];
      const older =
        transformedRecentResults[transformedRecentResults.length - 1];
      improvementTrend = (recent?.percentage || 0) - (older?.percentage || 0);
    }

    return {
      // Basic info
      student,
      exams: upcomingExams,
      availableExam,
      completedExam,
      recentResults: transformedRecentResults,

      // Analytics
      analytics: {
        totalAttempts,
        avgScore: Math.round(avgScore * 10) / 10,
        overallPercentage: Math.round(overallPercentage * 10) / 10,
        accuracy: Math.round(accuracy * 10) / 10,
        totalCorrect,
        totalWrong,
        totalSkipped,
        totalQuestions,
        bestStreak,
        currentStreak: streakInfo?.currentStreak || 0,
        highestScore: Math.round(highestScore * 10) / 10,
        improvementTrend: Math.round(improvementTrend * 10) / 10,
      },
    };
  }),
} satisfies TRPCRouterRecord;
