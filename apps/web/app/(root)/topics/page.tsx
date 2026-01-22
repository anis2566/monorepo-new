import { Metadata } from "next";

import { TopicsView } from "@/modules/topic/ui/views/topics-view";
import { SearchParams } from "nuqs";
import { getTopics } from "@/modules/topic/filters/get-topics";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Topics",
  description: "Topics",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Topics = async ({ searchParams }: Props) => {
  const params = await getTopics(searchParams);

  prefetch(trpc.admin.topic.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <TopicsView />
    </HydrateClient>
  );
};

export default Topics;
