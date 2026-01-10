"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetSubjects } from "../../filters/use-get-subjects";
import { SubjectList } from "../components/subject-list";
import { Filter } from "../components/filter";

export const SubjectsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetSubjects();

  const { data } = useSuspenseQuery(
    trpc.admin.subject.getMany.queryOptions(filters)
  );

  const { subjects = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <SubjectList subjects={subjects} totalCount={totalCount} />
    </div>
  );
};
