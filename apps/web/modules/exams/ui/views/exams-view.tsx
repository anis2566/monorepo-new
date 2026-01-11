"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { Stats } from "../components/stats";
import { useGetExams } from "../../filters/use-get-exams";
import { ExamList } from "./exam-list";
import { Filter } from "../components/filter";

export const ExamsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetExams();

  const { data } = useSuspenseQuery(
    trpc.admin.exam.getMany.queryOptions(filters)
  );

  const {
    exams = [],
    totalCount = 0,
    totalExam = 0,
    activeExam = 0,
    upcomingExam = 0,
    completedExam = 0,
  } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Stats
        totalExams={totalExam}
        activeExams={activeExam}
        upcomingExams={upcomingExam}
        completedExams={completedExam}
      />
      <Filter />
      <ExamList exams={exams} totalCount={totalCount} />
    </div>
  );
};
