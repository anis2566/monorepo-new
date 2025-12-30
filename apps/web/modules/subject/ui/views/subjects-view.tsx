"use client";

import { PlusActionButton } from "@workspace/ui/shared/plus-action-button";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetSubjects } from "../../filters/use-get-subjects";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { useCreateSubject } from "@/hooks/use-subject";
import { SubjectList } from "../components/subjects-list";
import { Filter } from "../components/filter";

export const SubjectsView = () => {
  const { onOpen } = useCreateSubject();

  const trpc = useTRPC();
  const [filters] = useGetSubjects();

  const { data } = useSuspenseQuery(
    trpc.admin.subject.getMany.queryOptions(filters)
  );

  const { subjects = [], totalCount = 0 } = data || {};

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

      <ListCardWrapper title="Manage Subject" value={totalCount}>
        <Filter />
        <SubjectList subjects={subjects} />
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
