import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import { prisma } from "@workspace/db";
import { NewMcqsView } from "@/modules/chapters/ui/views/new-mcqs-view";

export const metadata: Metadata = {
  title: "New MCQs",
  description: "New MCQs",
};

interface Props {
  params: Promise<{ id: string }>;
}

const NewMcqs = async ({ params }: Props) => {
  const { id } = await params;

  const chapter = await prisma.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    redirect(`/chapters`);
  }

  return (
    <HydrateClient>
      <NewMcqsView chapterId={id} subjectId={chapter.subjectId} />
    </HydrateClient>
  );
};

export default NewMcqs;
