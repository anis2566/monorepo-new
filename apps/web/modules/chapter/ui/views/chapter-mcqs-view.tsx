"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import { MCQList } from "../components/mcq-list";
import { useGetMcqs } from "../../filters/use-get-mcqs";
import { FilterInput } from "@workspace/ui/shared/filter-input";

interface ChapterMCQsViewProps {
  chapterId: string;
}

export const ChapterMCQsView = ({ chapterId }: ChapterMCQsViewProps) => {
  const trpc = useTRPC();
  const [filters, setFilters] = useGetMcqs();

  const { data: mcqs } = useQuery(
    trpc.admin.mcq.getManyByChapter.queryOptions({ chapterId, ...filters })
  );

  const handleSearchChange = (value: string) => {
    setFilters({
      search: value,
    });
  };

  return (
    <div className="relative">
      <div className="sticky top-10 left-0 z-50 bg-background pb-4 mb-4">
        <FilterInput
          type="search"
          placeholder="search exam..."
          value={filters.search}
          onChange={handleSearchChange}
          showInMobile
          className="w-full max-w-full"
        />
      </div>
      <MCQList mcqs={mcqs || []} />
    </div>
  );
};
