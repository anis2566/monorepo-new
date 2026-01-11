"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useQueries } from "@tanstack/react-query";

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

import { useGetStudents } from "../../filters/use-get-students";

export const Filter = () => {
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const [filters, setFilters] = useGetStudents();
  const trpc = useTRPC();

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameId.queryOptions(selectedClassId),
    ],
  });

  const classData = results[0]?.data;
  const batchData = results[1]?.data;

  const CLASS_OPTIONS = [
    {
      value: "All",
      label: "All",
    },
    ...(classData?.map((classItem) => ({
      value: classItem.id,
      label: classItem.name,
    })) || []),
  ];

  const BATCH_OPTIONS = [
    {
      value: "All",
      label: "All",
    },
    ...(batchData?.map((batchItem) => ({
      value: batchItem.id,
      label: batchItem.name,
    })) || []),
  ];

  const debounceSearchValue = useDebounce(searchName, 500);
  const debounceSearchId = useDebounce(searchId, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  useEffect(() => {
    setFilters({
      ...filters,
      id: debounceSearchId,
    });
  }, [debounceSearchId, setFilters, filters]);

  const handleClassNameChange = (value: string) => {
    setSelectedClassId(value);
    setSearchName("");
    setSearchId("");
    setFilters({
      batchId: "",
      classNameId: value,
    });
  };

  const handleBatchChange = (value: string) => {
    setFilters({
      ...filters,
      batchId: value,
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ID..."
              className="pl-9"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              onValueChange={handleClassNameChange}
              value={filters.classNameId}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((classItem) => (
                  <SelectItem key={classItem.value} value={classItem.value}>
                    {classItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Select onValueChange={handleBatchChange} value={filters.batchId}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                {BATCH_OPTIONS.map((batchItem) => (
                  <SelectItem key={batchItem.value} value={batchItem.value}>
                    {batchItem.label}
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
