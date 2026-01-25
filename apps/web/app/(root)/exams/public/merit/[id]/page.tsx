import { PublicExamMeritView } from "@/modules/exams/ui/views/public-exam-merit-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Merit List",
  description: "Public Merit List of an Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Merit = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.admin.publicExam.getMeritList.queryOptions({ examId: id }));

  return (
    <HydrateClient>
      <PublicExamMeritView examId={id} />
    </HydrateClient>
  );
};

export default Merit;
