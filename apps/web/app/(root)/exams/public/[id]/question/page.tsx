import { PublicExamAssignQuestionView } from "@/modules/exams/ui/views/public-exam-assign-question-view";
import { HydrateClient } from "@/trpc/server";
import { prisma } from "@workspace/db";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Assign Public Exam Question",
  description: "Form to assign questions to an existing Public Exam",
};

interface Props {
  params: Promise<{ id: string }>;
}

const AssignQuestions = async ({ params }: Props) => {
  const { id } = await params;

  const exam = await prisma.publicExam.findUnique({
    where: {
      id,
    },
    include: {
      subjects: {
        select: {
          subjectId: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!exam) {
    return redirect("/exam");
  }

  return (
    <HydrateClient>
      <PublicExamAssignQuestionView exam={exam} />
    </HydrateClient>
  );
};

export default AssignQuestions;
