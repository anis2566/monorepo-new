"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

import { useGetChapters } from "../../filters/use-get-chapters";

export const Filter = () => {
  const [searchName, setSearchName] = useState("");

  const [filters, setFilters] = useGetChapters();
  const trpc = useTRPC();

  const { data: subjects } = useQuery(
    trpc.admin.subject.forSelect.queryOptions({ search: "" })
  );

  const SUBJECT_OPTIONS = [
    {
      value: "All",
      label: "All",
    },
    ...(subjects?.map((subjectItem) => ({
      value: subjectItem.id,
      label: subjectItem.name,
    })) || []),
  ];

  const debounceSearchValue = useDebounce(searchName, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  const handleSubjectChange = (value: string) => {
    setFilters({
      ...filters,
      subjectId: value,
    });
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name..."
              className="pl-9"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              onValueChange={handleSubjectChange}
              value={filters.subjectId}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((subjectItem) => (
                  <SelectItem key={subjectItem.value} value={subjectItem.value}>
                    {subjectItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
