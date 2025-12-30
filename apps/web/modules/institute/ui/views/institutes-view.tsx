"use client";

import { PlusActionButton } from "@workspace/ui/shared/plus-action-button";
import { useCreateInstitute } from "@/hooks/use-institute";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetInstitutes } from "../../filters/use-get-institutes";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { InstituteList } from "../components/institute-list";
import { Filter } from "../components/filter";

export const InstitutesView = () => {
  const { onOpen } = useCreateInstitute();

  const trpc = useTRPC();
  const [filters] = useGetInstitutes();

  const { data } = useSuspenseQuery(
    trpc.admin.institute.getMany.queryOptions(filters)
  );

  const { institutes = [], totalCount = 0 } = data || {};

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

      <ListCardWrapper title="Manage Institute" value={totalCount}>
        <Filter />
        <InstituteList institutes={institutes} />
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
