import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getSubjects } from "@/modules/subjects/filters/get-subjects";
import { SubjectsView } from "@/modules/subjects/ui/views/subjects-view";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Subjects",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Subjects = async ({ searchParams }: Props) => {
  const params = await getSubjects(searchParams);

  prefetch(trpc.admin.subject.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <SubjectsView />
    </HydrateClient>
  );
};

export default Subjects;
