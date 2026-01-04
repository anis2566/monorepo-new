import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Exam",
  description: "Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Exam = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.student.exam.getForExam.queryOptions({ id }));

  return <HydrateClient>Exam</HydrateClient>;
};

export default Exam;
