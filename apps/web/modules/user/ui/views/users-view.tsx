"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { ListPagination } from "@workspace/ui/shared/list-pagination";
import { useGetUsers } from "../../filters/use-get-users";
import { UserList } from "../components/user-list";
import { Filter } from "../components/filter";

export const UsersView = () => {
  const trpc = useTRPC();
  const [filters] = useGetUsers();

  const { data } = useSuspenseQuery(
    trpc.admin.user.getMany.queryOptions(filters)
  );

  const { users = [], totalCount = 0 } = data || {};

  const handlePageChange = (page: number) => {
    filters.page = page;
  };

  return (
    <ListCardWrapper title="Manage User" value={totalCount}>
      <Filter />
      <UserList users={users} />
      <ListPagination
        totalCount={totalCount}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
      />
    </ListCardWrapper>
  );
};
