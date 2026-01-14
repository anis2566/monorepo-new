"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import TakePublicExam from "@/modules/exam/ui/views/take-public-exam-view";

interface Props {
  params: Promise<{ id: string; attemptId: string }>;
}

export default function PublicExamTakePage({ params }: Props) {
  const { id, attemptId } = use(params);
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId") || "";

  return (
    <div className="min-h-screen">
      <TakePublicExam
        examId={id}
        attemptId={attemptId}
        participantId={participantId}
      />
    </div>
  );
}
