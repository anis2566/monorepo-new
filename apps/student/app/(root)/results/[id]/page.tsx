import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ResultDetailView } from "@/modules/result/ui/views/result-details-view";

export const metadata: Metadata = {
  title: "Result",
  description: "Result",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Result = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.student.result.getResult.queryOptions({ attemptId: id }));

  return (
    <HydrateClient>
      <ResultDetailView attemptId={id} />
    </HydrateClient>
  );
};

export default Result;
