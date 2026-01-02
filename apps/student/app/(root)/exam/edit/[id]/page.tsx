import { EditExamView } from "@/modules/exam/ui/views/edit-exam-view";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Exam",
  description: "Form to edit an existing Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditExam = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <EditExamView examId={id} />
    </HydrateClient>
  );
};

export default EditExam;
