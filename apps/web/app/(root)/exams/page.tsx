import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { getExams } from "@/modules/exams/filters/get-exams";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ExamsView } from "@/modules/exams/ui/views/exams-view";

export const metadata: Metadata = {
  title: "Exams",
  description: "Exams",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Exams = async ({ searchParams }: Props) => {
  const params = await getExams(searchParams);

  prefetch(trpc.admin.exam.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <ExamsView />
    </HydrateClient>
  );
};

export default Exams;
