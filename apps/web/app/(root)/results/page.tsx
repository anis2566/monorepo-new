import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ResultsView } from "@/modules/results/ui/views/results-view";
import { SearchParams } from "nuqs";
import { getResults } from "@/modules/results/filters/get-results";

export const metadata: Metadata = {
  title: "Results",
  description: "Results",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Results = async ({ searchParams }: Props) => {
  const params = await getResults(searchParams);

  prefetch(trpc.admin.result.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <ResultsView />
    </HydrateClient>
  );
};

export default Results;
