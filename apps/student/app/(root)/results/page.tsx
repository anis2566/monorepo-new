import { ResultView } from "@/modules/result/ui/views/result-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results",
  description: "Results",
};

const Results = () => {
  prefetch(trpc.student.result.getResults.queryOptions());

  return (
    <HydrateClient>
      <ResultView />
    </HydrateClient>
  );
};

export default Results;
