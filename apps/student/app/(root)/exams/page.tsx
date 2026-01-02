import { ExamView } from "@/modules/exam/ui/views/exam-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exams",
  description: "Exams",
};

const Exams = () => {
  return <ExamView />;
};

export default Exams;
