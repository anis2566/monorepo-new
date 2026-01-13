"use client";

import { Button } from "@workspace/ui/components/button";
import {
  XCircle,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  ListOrdered,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReviewAnswersSection } from "../components/review-answers";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  const [examEnded, setExamEnded] = useState(false);
  const [timeUntilEnd, setTimeUntilEnd] = useState<string>("");

  // Check exam end status
  useEffect(() => {
    const endTime = data?.attempt?.endTime;

    if (!endTime) {
      setExamEnded(true);
      setTimeUntilEnd("");
      return;
    }

    const checkExamEnd = () => {
      const now = new Date();
      const end = new Date(endTime);

      if (now >= end) {
        setExamEnded(true);
        setTimeUntilEnd("");
      } else {
        setExamEnded(false);
        const diff = end.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
          const days = Math.floor(hours / 24);
          setTimeUntilEnd(`${days}d ${hours % 24}h`);
        } else if (hours > 0) {
          setTimeUntilEnd(`${hours}h ${minutes}m`);
        } else {
          setTimeUntilEnd(`${minutes}m`);
        }
      }
    };

    checkExamEnd();
    const interval = setInterval(checkExamEnd, 60000);

    return () => clearInterval(interval);
  }, [data?.attempt?.endTime]);

  if (isLoading) {
    return (
      <>
        <ResultHeader
          onBack={() => router.back()}
          endDate={undefined}
          examId=""
          examEnded={false}
          timeUntilEnd=""
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading result...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <ResultHeader
          onBack={() => router.back()}
          endDate={undefined}
          examId=""
          examEnded={false}
          timeUntilEnd=""
        />
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
      </>
    );
  }

  const { attempt, reviewQuestions } = data;

  const handleDownload = () => {
    toast.info("Download feature coming soon!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${attempt.examTitle} - Result`,
          text: `I scored ${attempt.percentage.toFixed(0)}% (${attempt.grade}) in ${attempt.examTitle}!`,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled share
        });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <ResultHeader
        onBack={() => router.back()}
        examTitle={attempt.examTitle}
        onDownload={handleDownload}
        onShare={handleShare}
        endDate={attempt.endTime ?? undefined}
        examId={attempt.examId}
        examEnded={examEnded}
        timeUntilEnd={timeUntilEnd}
      />

      <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Right Column - Review Questions */}
          <div className="lg:col-span-2">
            <ReviewAnswersSection
              reviewQuestions={reviewQuestions}
              correctCount={attempt.correctAnswers}
              wrongCount={attempt.wrongAnswers}
              skippedCount={attempt.skippedQuestions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Separate Header Component
function ResultHeader({
  onBack,
  examTitle,
  onDownload,
  onShare,
  examId,
  examEnded,
  timeUntilEnd,
}: {
  onBack: () => void;
  examTitle?: string;
  onDownload?: () => void;
  onShare?: () => void;
  endDate?: Date;
  examId: string;
  examEnded: boolean;
  timeUntilEnd: string;
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-foreground">
              Result Details
            </h1>
            {examTitle && (
              <p className="text-sm text-muted-foreground hidden lg:block">
                {examTitle}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Merit Button */}
        <div className="hidden lg:flex items-center gap-2">
          {examEnded ? (
            <Button asChild variant="default" size="sm">
              <Link href={`/exams/merit/${examId}`}>
                <ListOrdered className="w-4 h-4 mr-2" />
                View Merit List
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled className="gap-2">
              <Loader2 className="w-4 w-4 animate-spin" />
              <span className="text-xs">{timeUntilEnd}</span>
            </Button>
          )}

          {onDownload && onShare && (
            <>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
