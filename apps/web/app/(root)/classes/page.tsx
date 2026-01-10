import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getClasses } from "@/modules/classes/filters/get-classes";
import { ClassesView } from "@/modules/classes/ui/views/classes-view";

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
