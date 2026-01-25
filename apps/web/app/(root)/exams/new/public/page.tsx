import { NewPublicExamView } from "@/modules/exams/ui/views/new-public-exam-view";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Public Exam",
  description: "Create a new Public Exam",
};

const NewPublicExam = () => {
  return (
    <HydrateClient>
      <NewPublicExamView />
    </HydrateClient>
  );
};

export default NewPublicExam;
