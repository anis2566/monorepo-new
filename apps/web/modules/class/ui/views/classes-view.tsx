"use client";

import { PlusActionButton } from "@workspace/ui/shared/plus-action-button";
import { useCreateClass } from "@/hooks/use-class";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetClasses } from "../../filters/use-get-classes";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { ClassList } from "../components/class-list";
import { Filter } from "../components/filter";

export const ClassesView = () => {
  const { onOpen } = useCreateClass();

  const trpc = useTRPC();
  const [filters] = useGetClasses();

  const { data } = useSuspenseQuery(
    trpc.admin.class.getMany.queryOptions(filters)
  );

  const { classes = [], totalCount = 0 } = data || {};

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

      <ListCardWrapper title="Manage Class" value={totalCount}>
        <Filter />
        <ClassList classes={classes} />
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
