"use client";

import { PlusActionButton } from "@workspace/ui/shared/plus-action-button";
import { useCreateChapter } from "@/hooks/use-chapter";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetChapters } from "../../filters/use-get-chapters";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { ChapterList } from "../components/chapters-list";
import { Filter } from "../components/filter";

export const ChaptersView = () => {
  const { onOpen } = useCreateChapter();

  const trpc = useTRPC();
  const [filters] = useGetChapters();

  const { data } = useSuspenseQuery(
    trpc.admin.chapter.getMany.queryOptions(filters)
  );

  const { chapters = [], totalCount = 0 } = data || {};

  const handlePageChange = (page: number) => {
    filters.page = page;
  };

  return (
    <div className="w-full space-y-4">
      <PlusActionButton
        onClickAction={() => onOpen()}
        actionButtonText="Add New"
        actionButtonVariant="outline"
      />

      <ListCardWrapper title="Manage Chapters" value={totalCount}>
        <Filter />
        <ChapterList chapters={chapters} />
        <ListPagination
          totalCount={totalCount}
          currentPage={filters.page}
          pageSize={filters.limit}
          onPageChange={handlePageChange}
        />
      </ListCardWrapper>
    </div>
  );
};
