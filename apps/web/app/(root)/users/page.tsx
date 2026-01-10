import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { UsersView } from "@/modules/users/ui/views/users-view";
import { getUsers } from "@/modules/users/filters/use-user";

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Users = async ({ searchParams }: Props) => {
  const params = await getUsers(searchParams);

  prefetch(trpc.admin.user.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
};

export default Users;
