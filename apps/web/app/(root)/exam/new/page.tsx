import { NewExamView } from "@/modules/exam/ui/views/new-exam-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Exam",
  description: "Create a new Exam",
};

const NewExam = () => {
  return <NewExamView />;
};

export default NewExam;
