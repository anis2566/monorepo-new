"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetInstitutes } from "../../filters/use-get-institutes";
import { InstituteList } from "../components/institute-list";

export const InstitutesView = () => {
  const trpc = useTRPC();
  const [filters] = useGetInstitutes();

  const { data } = useSuspenseQuery(
    trpc.admin.institute.getMany.queryOptions(filters)
  );

  const { institutes = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <InstituteList institutes={institutes} totalCount={totalCount} />
    </div>
  );
};
