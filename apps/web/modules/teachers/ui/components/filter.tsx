"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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

import { useGetTeachers } from "../../filters/use-get-teachers";

export const Filter = () => {
  const [searchName, setSearchName] = useState("");

  const [filters, setFilters] = useGetTeachers();

  const SUBJECT_OPTIONS = [
    "Physics",
    "Chemistry",
    "Higher Math",
    "Biology",
    "Bengla",
    "English",
    "ICT",
  ].map((subject) => ({
    label: subject,
    value: subject,
  }));

  const debounceSearchValue = useDebounce(searchName, 2000);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  const handleSubjectChange = (value: string) => {
    setFilters({
      ...filters,
      subject: value,
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
              type="search"
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={handleSubjectChange} value={filters.subject}>
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
