"use client";

import { PublicExamStats } from "../components/public-exam-stat";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetPublicExams } from "../../filters/use-get-public-exams";
import { PublicExamFilter } from "../components/public-exam-filter";
import { PublicExamList } from "../components/public-exam-list";

export const PublicExamsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetPublicExams();

  const { data } = useSuspenseQuery(
    trpc.admin.publicExam.getMany.queryOptions(filters),
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
      <PublicExamStats
        totalExams={totalExam}
        activeExams={activeExam}
        upcomingExams={upcomingExam}
        completedExams={completedExam}
      />
      <PublicExamFilter />
      <PublicExamList exams={exams} totalCount={totalCount} />
    </div>
  );
};
