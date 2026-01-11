"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetResults } from "../../filters/use-get-results";
import { Stats } from "../components/stats";
import { ResultList } from "../components/result-list";
import { Filter } from "../components/filter";

export const ResultsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetResults();

  const { data } = useSuspenseQuery(
    trpc.admin.result.getMany.queryOptions(filters)
  );

  const {
    results = [],
    totalCount = 0,
    totalResult = 0,
    activeResult = 0,
    completedResult = 0,
    averageScore = 0,
  } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Stats
        totalAttempts={totalResult}
        completedAttempts={completedResult}
        inProgressAttempts={activeResult}
        averageScore={averageScore}
      />
      <Filter />
      <ResultList results={results} totalCount={totalCount} />
    </div>
  );
};
