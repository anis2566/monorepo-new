import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import { NewMcqsView } from "@/modules/chapter/ui/views/new-mcqs-view";
import { redirect } from "next/navigation";
import { prisma } from "@workspace/db";

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
    redirect(`/chapter`);
  }

  return (
    <HydrateClient>
      <NewMcqsView chapterId={id} subjectId={chapter.subjectId} />
    </HydrateClient>
  );
};

export default NewMcqs;
