"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { useGetTeachers } from "../../filters/use-get-teachers";
import { Header } from "../components/header";
import { TeacherList } from "../components/teacher-list";
import { Filter } from "../components/filter";

export const TeachersView = () => {
  const trpc = useTRPC();
  const [filters] = useGetTeachers();

  const { data } = useSuspenseQuery(
    trpc.admin.teacher.getMany.queryOptions(filters),
  );

  const { teachers = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <TeacherList teachers={teachers} totalCount={totalCount} />
    </div>
  );
};
