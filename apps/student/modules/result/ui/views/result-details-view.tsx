"use client";

import { Button } from "@workspace/ui/components/button";
import { XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewAnswersSection } from "../components/review-answers";

interface ResultDetailProps {
  attemptId: string;
}

export const ResultDetailView = ({ attemptId }: ResultDetailProps) => {
  const router = useRouter();
  const trpc = useTRPC();

  // Fetch result data
  const { data, isLoading, error } = useSuspenseQuery(
    trpc.student.result.getResult.queryOptions({ attemptId })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading result...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">
            {error?.message || "Result not found"}
          </p>
          <Button onClick={() => router.push("/results")}>
            Back to Results
          </Button>
        </div>
      </div>
    );
  }

  const { attempt, reviewQuestions } = data;

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto">
      <ReviewAnswersSection
        reviewQuestions={reviewQuestions}
        correctCount={attempt.correctAnswers}
        wrongCount={attempt.wrongAnswers}
        skippedCount={attempt.skippedQuestions}
      />
    </div>
  );
};
