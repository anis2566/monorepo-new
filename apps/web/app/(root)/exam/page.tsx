import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { getExams } from "@/modules/exam/filters/get-exams";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ExamsView } from "@/modules/exam/ui/views/exams-view";

export const metadata: Metadata = {
  title: "Exam",
  description: "Exam",
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
