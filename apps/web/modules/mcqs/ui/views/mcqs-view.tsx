"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "../components/header";
import { McqList } from "../components/mcq-list";
import { useGetMcqs } from "../../filters/use-get-mcqs";
import { Filter } from "../components/filter";
import { Stats } from "../components/stats";

export const McqsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetMcqs();

  const { data } = useSuspenseQuery(
    trpc.admin.mcq.getMany.queryOptions(filters)
  );

  const {
    mcqs = [],
    totalCount = 0,
    singleMcqs = 0,
    multipleMcqs = 0,
    contextualMcqs = 0,
  } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Stats
        totalMcqs={totalCount}
        singleMcqs={singleMcqs}
        multipleMcqs={multipleMcqs}
        contextualMcqs={contextualMcqs}
      />
      <Filter />
      <McqList mcqs={mcqs} totalCount={totalCount} />
    </div>
  );
};
