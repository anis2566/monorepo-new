import { Metadata } from "next";

import { ClassesView } from "@/modules/class/ui/views/classes-view";
import { SearchParams } from "nuqs";
import { getClasses } from "@/modules/class/filters/get-classes";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Classes",
  description: "Classes",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Classes = async ({ searchParams }: Props) => {
  const params = await getClasses(searchParams);

  prefetch(trpc.admin.class.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <ClassesView />
    </HydrateClient>
  );
};

export default Classes;
