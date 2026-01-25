import { createTRPCRouter, publicProcedure } from "../../trpc";
import { EXAM_STATUS } from "@workspace/utils/constant";

export const examRouter = createTRPCRouter({
  getPublicExam: publicProcedure.query(async ({ ctx }) => {
    const exam = await ctx.db.publicExam.findFirst({
      where: {
        status: EXAM_STATUS.Ongoing,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!exam) return null;

    return {
      id: exam.id,
      title: exam.title,
      total: exam.total,
      duration: exam.duration,
      mcq: exam.mcq,
      startDate: exam.startDate,
      endDate: exam.endDate,
      hasNegativeMark: exam.hasNegativeMark,
      negativeMark: exam.negativeMark,
      type: exam.type,
      status: exam.status,
      subjects: exam.subjects.map((s) => s.subject.name),
      participants: exam._count.attempts,
    };
  }),
});
