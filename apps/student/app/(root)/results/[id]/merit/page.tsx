import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { MeritView } from "@/modules/result/ui/views/merit-view";
import { prisma } from "@workspace/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Merit List",
  description: "Merit List",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Merit = async ({ params }: Props) => {
  const { id } = await params;

  const result = await prisma.examAttempt.findUnique({
    where: {
      id,
    },
    include: {
      exam: true,
    },
  });

  if (!result) {
    return redirect("/results");
  }

  return (
    <HydrateClient>
      <MeritView examId={result.exam.id} />
    </HydrateClient>
  );
};

export default Merit;
