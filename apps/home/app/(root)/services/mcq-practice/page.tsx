import { Metadata } from "next";

import { McqPracticeService } from "@/modules/services/ui/views/mcq-practice-service";

export const metadata: Metadata = {
  title: "MCQ Practice",
  description: "MCQ Practice",
};

const McqPracticePage = () => {
  return <McqPracticeService />;
};

export default McqPracticePage;
