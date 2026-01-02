"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { useGetExams } from "@/modules/exam/filters/use-get-exams";
import { ExamList } from "../components/exam-list";
import { Filter } from "../components/filter";

export const ExamsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetExams();

  const { data } = useSuspenseQuery(
    trpc.admin.exam.getMany.queryOptions(filters)
  );

  const { exams = [], totalCount = 0 } = data || {};

  const handlePageChange = (page: number) => {
    filters.page = page;
  };

  return (
    <ListCardWrapper title="Manage Exams" value={totalCount}>
      <Filter />
      <ExamList exams={exams} />
      <ListPagination
        totalCount={totalCount}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
      />
    </ListCardWrapper>
  );
};
