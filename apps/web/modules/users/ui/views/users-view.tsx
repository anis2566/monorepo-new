"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { useGetUsers } from "../../filters/use-get-users";
import { Filter } from "../components/filter";
import { UserList } from "../components/user-list";
import { Header } from "../components/header";

export const UsersView = () => {
  const trpc = useTRPC();
  const [filters] = useGetUsers();

  const { data } = useSuspenseQuery(
    trpc.admin.user.getMany.queryOptions(filters)
  );

  const { users = [], totalCount = 0 } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Filter />
      <UserList users={users} totalCount={totalCount} />
    </div>
  );
};
