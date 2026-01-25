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
import { EXAM_STATUS } from "@workspace/utils/constant";

import { useGetExams } from "../../filters/use-get-exams";

const EXAM_STATUS_OPTIONS = ["All", ...Object.values(EXAM_STATUS)].map(
  (status) => ({
    value: status,
    label: status,
  }),
);

export const PublicExamFilter = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const [filters, setFilters] = useGetExams();
  const trpc = useTRPC();

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.subject.getByClassNameId.queryOptions(selectedClassId),
    ],
  });

  const classData = results[0]?.data;
  const subjectData = results[1]?.data;

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

  const SUBJECT_OPTIONS = [
    {
      value: "All",
      label: "All",
    },
    ...(subjectData?.map((subjectItem) => ({
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

  const handleClassNameChange = (value: string) => {
    setSelectedClassId(value);
    setSearchName("");
    setFilters({
      batchId: "",
      subjectId: "",
      classNameId: value,
    });
  };

  const handleSubjectChange = (value: string) => {
    setSearchName("");
    setFilters({
      ...filters,
      subjectId: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value,
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
            <Select onValueChange={handleStatusChange} value={filters.status}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.value}
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
