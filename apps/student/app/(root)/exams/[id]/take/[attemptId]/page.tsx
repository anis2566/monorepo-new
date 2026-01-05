import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import TakeExam from "@/modules/exam/ui/views/take-exam-view";

export const metadata: Metadata = {
  title: "Exam",
  description: "Exam",
};

interface Props {
  params: Promise<{ id: string; attemptId: string }>;
}

const Exam = async ({ params }: Props) => {
  const { id, attemptId } = await params;

  prefetch(trpc.student.exam.getForExam.queryOptions({ id }));

  return (
    <HydrateClient>
      <TakeExam examId={id} attemptId={attemptId} />
    </HydrateClient>
  );
};

export default Exam;
