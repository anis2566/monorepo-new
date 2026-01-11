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
import { LEVEL } from "@workspace/utils/constant";

import { useGetSubjects } from "../../filters/use-get-subjects";

const LEVEL_OPTIONS = ["All", ...Object.values(LEVEL)].map((level) => ({
  value: level,
  label: level,
}));

export const Filter = () => {
  const [searchName, setSearchName] = useState("");

  const [filters, setFilters] = useGetSubjects();

  const debounceSearchValue = useDebounce(searchName, 2000);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  const handleLevelChange = (value: string) => {
    setFilters({
      ...filters,
      level: value,
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
            <Select onValueChange={handleLevelChange} value={filters.level}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((levelItem) => (
                  <SelectItem key={levelItem.value} value={levelItem.value}>
                    {levelItem.label}
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
