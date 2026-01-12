import { ExamDetailView } from "@/modules/exams/ui/views/exam-detail-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Details",
  description: "Exam Details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const ExamDetail = async ({ params }: Props) => {
  const { id } = await params;

  await Promise.all([
    prefetch(
      trpc.admin.exam.getExamDetails.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getExamStats.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getExamAttempts.queryOptions({
        examId: id,
        page: 1,
        limit: 10,
      })
    ),
    prefetch(
      trpc.admin.exam.getExamMcqs.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getScoreDistribution.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getAnswerDistribution.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getTimeAnalysis.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getAntiCheatSummary.queryOptions({
        examId: id,
      })
    ),
    prefetch(
      trpc.admin.exam.getPerformanceOverview.queryOptions({
        examId: id,
      })
    ),
  ]);

  return (
    <HydrateClient>
      <ExamDetailView examId={id} />
    </HydrateClient>
  );
};

export default ExamDetail;
