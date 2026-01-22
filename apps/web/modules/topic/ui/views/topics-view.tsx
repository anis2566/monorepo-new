"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { Header } from "../components/header";
import { useGetTopics } from "../../filters/use-get-topics";
import { TopicList } from "../components/topic-list";
import { Filter } from "../components/filter";

export const TopicsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetTopics();

  const { data } = useSuspenseQuery(
    trpc.admin.topic.getMany.queryOptions(filters),
  );

  const { topics = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <TopicList topics={topics} totalCount={totalCount} />
    </div>
  );
};
