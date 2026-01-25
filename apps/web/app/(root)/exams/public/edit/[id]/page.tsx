import { EditPublicExamView } from "@/modules/exams/ui/views/edit-public-exam-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Public Exam",
  description: "Form to edit an existing Public Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditPublicExam = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.admin.publicExam.getOne.queryOptions(id));

  return (
    <HydrateClient>
      <EditPublicExamView examId={id} />
    </HydrateClient>
  );
};

export default EditPublicExam;
