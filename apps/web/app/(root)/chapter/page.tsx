import { Metadata } from "next";

import { ChaptersView } from "@/modules/chapter/ui/views/chapters-view";
import { SearchParams } from "nuqs";
import { getChapters } from "@/modules/chapter/filters/get-chapters";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Chapter",
  description: "Chapter",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Chapters = async ({ searchParams }: Props) => {
  const params = await getChapters(searchParams);

  prefetch(trpc.admin.chapter.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <ChaptersView />
    </HydrateClient>
  );
};

export default Chapters;
