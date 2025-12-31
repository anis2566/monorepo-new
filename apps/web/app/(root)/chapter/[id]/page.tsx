import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ChapterMCQsView } from "@/modules/chapter/ui/views/chapter-mcqs-view";
import { SearchParams } from "nuqs";
import { getMcqs } from "@/modules/chapter/filters/get-mcqs";

export const metadata: Metadata = {
  title: "Chapter MCQs",
  description: "Chapter MCQs",
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

const ChapterMCQs = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const paramsQuery = await getMcqs(searchParams);

  prefetch(
    trpc.admin.mcq.getManyByChapter.queryOptions({
      chapterId: id,
      ...paramsQuery,
    })
  );

  return (
    <HydrateClient>
      <ChapterMCQsView chapterId={id} />
    </HydrateClient>
  );
};

export default ChapterMCQs;
