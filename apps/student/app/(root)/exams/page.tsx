import { getExams } from "@/modules/exam/filters/get-exam";
import { ExamView } from "@/modules/exam/ui/views/exam-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";

export const metadata: Metadata = {
  title: "Exams",
  description: "Exams",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Exams = async ({ searchParams }: Props) => {
  const params = await getExams(searchParams);

  prefetch(trpc.student.exam.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <ExamView />
    </HydrateClient>
  );
};

export default Exams;
