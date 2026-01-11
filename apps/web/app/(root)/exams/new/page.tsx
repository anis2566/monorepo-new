import { NewExamView } from "@/modules/exams/ui/views/new-exam-view";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Exam",
  description: "Create a new Exam",
};

const NewExam = () => {
  return (
    <HydrateClient>
      <NewExamView />
    </HydrateClient>
  );
};

export default NewExam;
