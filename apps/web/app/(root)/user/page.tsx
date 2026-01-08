import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { getClasses } from "@/modules/class/filters/get-classes";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { UsersView } from "@/modules/user/ui/views/users-view";

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Users = async ({ searchParams }: Props) => {
  const params = await getClasses(searchParams);

  prefetch(trpc.admin.user.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
};

export default Users;
