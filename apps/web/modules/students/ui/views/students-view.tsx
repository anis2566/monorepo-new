"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetStudents } from "../../filters/use-get-students";
import { StudentList } from "../components/student-list";
import { Filter } from "../components/filter";

export const StudentsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetStudents();

  const { data } = useSuspenseQuery(
    trpc.admin.student.getMany.queryOptions(filters)
  );

  const { students = [], totalCount = 0 } = data || {};
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <StudentList students={students} totalCount={totalCount} />
    </div>
  );
};
