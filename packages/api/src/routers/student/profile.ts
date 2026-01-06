import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { studentProcedure } from "../../trpc";

export const profileRouter = {
  get: studentProcedure.query(async ({ ctx }) => {
    // Get student with all related data
    const student = await ctx.db.student.findUnique({
      where: { id: ctx.studentId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        className: {
          select: {
            name: true,
          },
        },
        batch: {
          select: {
            name: true,
          },
        },
        institute: {
          select: {
            name: true,
            session: true,
          },
        },
      },
    });

    if (!student) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student profile not found",
      });
    }

    // Get exam statistics
    const [totalExams, completedExams, recentResults] = await Promise.all([
      // Total available exams
      ctx.db.exam.count({
        where: {
          students: {
            some: { studentId: ctx.studentId },
          },
        },
      }),

      // Completed exams
      ctx.db.examAttempt.count({
        where: {
          studentId: ctx.studentId,
          status: { in: ["Submitted", "Auto-Submitted"] },
        },
      }),

      // Recent results for average calculation
      ctx.db.examAttempt.findMany({
        where: {
          studentId: ctx.studentId,
          status: { in: ["Submitted", "Auto-Submitted"] },
        },
        select: {
          score: true,
          totalQuestions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10, // Last 10 for average
      }),
    ]);

    // Calculate average score
    let averageScore = 0;
    if (recentResults.length > 0) {
      const totalPercentage = recentResults.reduce((sum, result) => {
        const percentage =
          result.totalQuestions > 0
            ? (result.score / result.totalQuestions) * 100
            : 0;
        return sum + percentage;
      }, 0);
      averageScore = Math.round(totalPercentage / recentResults.length);
    }

    return {
      // Basic info
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      nameBangla: student.nameBangla,
      imageUrl: student.imageUrl,

      // Academic info
      className: student.className.name,
      batch: student.batch?.name || null,
      roll: student.roll,
      section: student.section,
      shift: student.shift,
      group: student.group,

      // Institute info
      instituteName: student.institute.name,
      session: student.institute.session,

      // Contact info
      email: student.user?.email || null,
      phone: student.user?.phone || null,
      fPhone: student.fPhone,
      mPhone: student.mPhone,

      // Personal info
      fName: student.fName,
      mName: student.mName,
      gender: student.gender,
      dob: student.dob,
      nationality: student.nationality,
      religion: student.religion,

      // Address info
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

      // Statistics
      stats: {
        totalExams,
        completedExams,
        averageScore,
        pendingExams: totalExams - completedExams,
      },
    };
  }),
} satisfies TRPCRouterRecord;
