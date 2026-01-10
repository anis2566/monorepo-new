"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetClasses } from "@/modules/classes/filters/use-get-classes";
import { ClassList } from "../components/class-list";

export const ClassesView = () => {
  const trpc = useTRPC();
  const [filters] = useGetClasses();

  const { data } = useSuspenseQuery(
    trpc.admin.class.getMany.queryOptions(filters)
  );

  const { classes = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <ClassList classes={classes} totalCount={totalCount} />
    </div>
  );
};
