"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetStudents } from "../../filters/use-get-students";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { StudentList } from "../components/student-list";
import { Filter } from "../components/filter";

export const StudentsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetStudents();

  const { data } = useSuspenseQuery(
    trpc.admin.student.getMany.queryOptions(filters)
  );

  const { students = [], totalCount = 0 } = data || {};

  const handlePageChange = (page: number) => {
    filters.page = page;
  };

  return (
    <ListCardWrapper title="Manage Student" value={totalCount}>
      <Filter />
      <StudentList students={students} />
      <ListPagination
        totalCount={totalCount}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
      />
    </ListCardWrapper>
  );
};
