import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { MeritView } from "@/modules/result/ui/views/merit-view";

export const metadata: Metadata = {
  title: "Merit List",
  description: "Merit List",
};

interface Props {
  params: Promise<{ examId: string }>;
}

const MeritList = async ({ params }: Props) => {
  const { examId } = await params;

  prefetch(trpc.student.exam.getMeritList.queryOptions({ examId }));

  return (
    <HydrateClient>
      <MeritView examId={examId} />
    </HydrateClient>
  );
};

export default MeritList;
