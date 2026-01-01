import { AssignQuestionView } from "@/modules/exam/ui/views/assign-question-view";
import { HydrateClient } from "@/trpc/server";
import { prisma } from "@workspace/db";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Assign Question",
  description: "Form to assign questions to an existing Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditExam = async ({ params }: Props) => {
  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      subjects: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!exam) {
    return redirect("/exam");
  }

  console.log(exam.subjects);

  return (
    <HydrateClient>
      <AssignQuestionView
        subjectIds={exam?.subjects.map((subject) => subject.id) || []}
        examId={exam.id}
      />
    </HydrateClient>
  );
};

export default EditExam;
