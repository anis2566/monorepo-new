"use client";

import { PlusActionButton } from "@workspace/ui/shared/plus-action-button";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetBatches } from "../../filters/use-get-batches";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { useCreateBatch } from "@/hooks/use-batch";
import { BatchList } from "../components/batch-list";
import { Filter } from "../components/filter";

export const BatchesView = () => {
  const { onOpen } = useCreateBatch();

  const trpc = useTRPC();
  const [filters] = useGetBatches();

  const { data } = useSuspenseQuery(
    trpc.admin.batch.getMany.queryOptions(filters)
  );

  const { batches = [], totalCount = 0 } = data || {};

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

      <ListCardWrapper title="Manage Batches" value={totalCount}>
        <Filter />
        <BatchList batches={batches} />
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
