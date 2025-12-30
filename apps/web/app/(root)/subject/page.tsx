import { Metadata } from "next";

import { SubjectsView } from "@/modules/subject/ui/views/subjects-view";
import { SearchParams } from "nuqs";
import { getSubjects } from "@/modules/subject/filters/get-subjects";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Subject",
  description: "Subject",
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
