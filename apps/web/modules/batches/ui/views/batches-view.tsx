"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { useGetBatches } from "../../filters/use-get-batches";
import { Header } from "../components/header";
import { BatchList } from "../components/batch-list";
import { Filter } from "../components/filter";

export const BatchesView = () => {
  const trpc = useTRPC();
  const [filters] = useGetBatches();

  const { data } = useSuspenseQuery(
    trpc.admin.batch.getMany.queryOptions(filters)
  );

  const { batches = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <BatchList batches={batches} totalCount={totalCount} />
    </div>
  );
};
