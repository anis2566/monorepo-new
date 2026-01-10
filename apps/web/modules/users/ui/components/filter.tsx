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
import { ROLE, USER_STATUS } from "@workspace/utils/constant";

import { useGetUsers } from "../../filters/use-get-users";

const ROLE_OPTIONS = ["All", ...Object.values(ROLE)].map((role) => ({
  value: role,
  label: role,
}));

const STATUS_OPTIONS = ["All", ...Object.values(USER_STATUS)].map((status) => ({
  value: status,
  label: status,
}));

export const Filter = () => {
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [filters, setFilters] = useGetUsers();
  const trpc = useTRPC();

  const { data: classes } = useQuery(
    trpc.admin.class.forSelect.queryOptions({ search: "" })
  );

  const CLASS_OPTIONS = [
    {
      value: "All",
      label: "All",
    },
    ...(classes?.map((classItem) => ({
      value: classItem.id,
      label: classItem.name,
    })) || []),
  ];

  const debounceSearchValue = useDebounce(searchName, 500);
  const debounceSearchEmail = useDebounce(searchEmail, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  useEffect(() => {
    setFilters({
      ...filters,
      email: debounceSearchEmail,
    });
  }, [debounceSearchEmail, setFilters, filters]);

  const handleRoleChange = (value: string) => {
    setFilters({
      ...filters,
      role: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value,
    });
  };

  const handleClassNameChange = (value: string) => {
    setFilters({
      ...filters,
      classNameId: value,
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
              placeholder="Search email..."
              className="pl-9"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
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
            <Select onValueChange={handleRoleChange} value={filters.role}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleStatusChange} value={filters.status}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
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
