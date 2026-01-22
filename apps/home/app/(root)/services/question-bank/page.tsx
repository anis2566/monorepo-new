import { Metadata } from "next";

import { QuestionBankServices } from "@/modules/services/ui/views/question-bank";

export const metadata: Metadata = {
  title: "Question Bank",
  description: "Question Bank",
};

const QuestionBankPage = () => {
  return <QuestionBankServices />;
};

export default QuestionBankPage;
