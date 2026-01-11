import { MeritView } from "@/modules/exams/ui/views/merit-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merit List",
  description: "Merit List of an Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Merit = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.admin.exam.getMeritList.queryOptions({ examId: id }));

  return (
    <HydrateClient>
      <MeritView examId={id} />
    </HydrateClient>
  );
};

export default Merit;
