import { Metadata } from "next";

import { InstitutesView } from "@/modules/institute/ui/views/institutes-view";
import { SearchParams } from "nuqs";
import { getInstitutes } from "@/modules/institute/filters/get-institutes";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Institute",
  description: "Institute",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Institutes = async ({ searchParams }: Props) => {
  const params = await getInstitutes(searchParams);

  prefetch(trpc.admin.institute.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <InstitutesView />
    </HydrateClient>
  );
};

export default Institutes;
