import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { getBatches } from "@/modules/batches/filters/get-batches";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { BatchesView } from "@/modules/batches/ui/views/batches-view";

export const metadata: Metadata = {
  title: "Batches",
  description: "Batches",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Batches = async ({ searchParams }: Props) => {
  const params = await getBatches(searchParams);

  prefetch(trpc.admin.batch.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <BatchesView />
    </HydrateClient>
  );
};

export default Batches;
