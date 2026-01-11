import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { McqsView } from "@/modules/mcqs/ui/views/mcqs-view";
import { SearchParams } from "nuqs";
import { getMcqs } from "@/modules/mcqs/filters/get-mcqs";

export const metadata: Metadata = {
  title: "MCQs",
  description: "MCQs",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Mcqs = async ({ searchParams }: Props) => {
  const params = await getMcqs(searchParams);

  prefetch(trpc.admin.mcq.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <McqsView />
    </HydrateClient>
  );
};

export default Mcqs;
