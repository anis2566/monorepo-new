import { Metadata } from "next";

import { QuestionBankServices } from "@/modules/services/ui/views/question-bank";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Question Bank",
  description: "Question Bank",
};

const QuestionBankPage = () => {
  return (
    <HydrateClient>
      <QuestionBankServices />
    </HydrateClient>
  );
};

export default QuestionBankPage;
