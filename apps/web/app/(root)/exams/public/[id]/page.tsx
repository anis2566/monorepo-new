import { PublicExamDetailView } from "@/modules/exams/ui/views/public-exam--view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Exam Details",
  description: "Public Exam Details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const ExamDetail = async ({ params }: Props) => {
  const { id } = await params;

  await Promise.all([
    prefetch(
      trpc.admin.publicExam.getExamDetails.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getExamStats.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getExamAttempts.queryOptions({
        examId: id,
        page: 1,
        limit: 10,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getExamMcqs.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getScoreDistribution.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getAnswerDistribution.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getTimeAnalysis.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getAntiCheatSummary.queryOptions({
        examId: id,
      }),
    ),
    prefetch(
      trpc.admin.publicExam.getPerformanceOverview.queryOptions({
        examId: id,
      }),
    ),
  ]);

  return (
    <HydrateClient>
      <PublicExamDetailView examId={id} />
    </HydrateClient>
  );
};

export default ExamDetail;
