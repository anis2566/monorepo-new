import { Metadata } from "next";

import { McqPracticeService } from "@/modules/services/ui/views/mcq-practice-service";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "MCQ Practice",
  description: "MCQ Practice",
};

const McqPracticePage = () => {
  return (
    <HydrateClient>
      <McqPracticeService />
    </HydrateClient>
  );
};

export default McqPracticePage;
