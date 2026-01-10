"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { ChapterList } from "../components/chapter-list";
import { useGetChapters } from "../../filters/use-get-chapters";
import { Filter } from "../components/filter";

export const ChaptersView = () => {
  const trpc = useTRPC();
  const [filters] = useGetChapters();

  const { data } = useSuspenseQuery(
    trpc.admin.chapter.getMany.queryOptions(filters)
  );

  const { chapters = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <ChapterList chapters={chapters} totalCount={totalCount} />
    </div>
  );
};
