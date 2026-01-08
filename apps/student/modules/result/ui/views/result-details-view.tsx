"use client";

import { Card } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Button } from "@workspace/ui/components/button";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format, intervalToDuration } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
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
      <>
        <ResultHeader onBack={() => router.back()} />
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
        <ResultHeader onBack={() => router.back()} />
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

  // ✅ Calculate negative marking penalty
  const penalty = attempt.hasNegativeMark
    ? attempt.wrongAnswers * attempt.negativeMark
    : 0;
  const scoreWithoutPenalty = attempt.correctAnswers;
  const hasPenalty = penalty > 0;

  const getScoreColor = () => {
    if (attempt.percentage >= 80) return "text-success";
    if (attempt.percentage >= 60) return "text-warning";
    return "text-destructive";
  };

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
      />

      <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Score Overview */}
          <div className="lg:col-span-1 space-y-6 mb-6 lg:mb-0">
            {/* Score Card */}
            <Card className="p-6 text-center gradient-hero">
              <Trophy className="w-14 h-14 mx-auto mb-4 text-primary" />
              <h2 className="text-base lg:text-lg font-medium text-foreground mb-1 line-clamp-2">
                {attempt.examTitle}
              </h2>
              <Badge className="mb-4">{attempt.type}</Badge>
              <p className="text-sm text-muted-foreground mb-6">
                {format(new Date(attempt.completedAt), "MMMM d, yyyy • h:mm a")}
              </p>

              <div className={cn("text-6xl font-bold mb-2", getScoreColor())}>
                {attempt.percentage.toFixed(0)}%
              </div>
              <div className="text-2xl font-semibold text-foreground mb-6">
                Grade: {attempt.grade}
              </div>

              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {attempt.score.toFixed(1)}
                  </p>
                  <p className="text-muted-foreground">Score</p>
                  {/* ✅ Show penalty if applied */}
                  {hasPenalty && (
                    <p className="text-xs text-destructive mt-1">
                      (-{penalty.toFixed(2)})
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {attempt.totalQuestions}
                  </p>
                  <p className="text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {(() => {
                      const duration = intervalToDuration({
                        start: new Date(attempt.startTime || new Date()),
                        end: new Date(attempt.completedAt || new Date()),
                      });
                      const value =
                        duration.hours ||
                        duration.minutes ||
                        duration.seconds ||
                        0;
                      return value;
                    })()}
                  </p>
                  <p className="text-muted-foreground">
                    {(() => {
                      const duration = intervalToDuration({
                        start: new Date(attempt.startTime || new Date()),
                        end: new Date(attempt.completedAt || new Date()),
                      });
                      if (duration.hours) return "Hours";
                      if (duration.minutes) return "Minutes";
                      return "Seconds";
                    })()}
                  </p>
                </div>
              </div>

              {/* ✅ Negative Marking Warning */}
              {hasPenalty && (
                <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-destructive">
                        Negative Marking Applied
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Before penalty: {scoreWithoutPenalty} → After penalty:{" "}
                        {attempt.score.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {attempt.wrongAnswers} wrong × {attempt.negativeMark} =
                        -{penalty.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Type Badge */}
              {attempt.submissionType && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      attempt.submissionType === "Manual"
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning"
                    )}
                  >
                    {attempt.submissionType === "Manual"
                      ? "Manually Submitted"
                      : attempt.submissionType === "Auto-TimeUp"
                        ? "Auto-Submitted (Time Up)"
                        : "Auto-Submitted (Tab Switch)"}
                  </span>
                </div>
              )}
            </Card>

            {/* ✅ Stats Grid with Negative Marking Info */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center bg-success/10 border-success/20">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">
                  {attempt.correctAnswers}
                </p>
                <p className="text-xs text-muted-foreground">Correct</p>
                {/* ✅ Show points if no negative marking */}
                {!attempt.hasNegativeMark && (
                  <p className="text-xs text-success mt-1">
                    +{attempt.correctAnswers}
                  </p>
                )}
              </Card>
              <Card className="p-4 text-center bg-destructive/10 border-destructive/20">
                <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
                <p className="text-2xl font-bold text-destructive">
                  {attempt.wrongAnswers}
                </p>
                <p className="text-xs text-muted-foreground">Wrong</p>
                {/* ✅ Show penalty if negative marking */}
                {hasPenalty && (
                  <p className="text-xs text-destructive mt-1">
                    -{penalty.toFixed(2)}
                  </p>
                )}
              </Card>
              <Card className="p-4 text-center bg-muted">
                <MinusCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">
                  {attempt.skippedQuestions}
                </p>
                <p className="text-xs text-muted-foreground">Skipped</p>
                <p className="text-xs text-muted-foreground mt-1">0</p>
              </Card>
            </div>

            {/* ✅ Performance Bar with Negative Marking Context */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Performance Breakdown</h3>
                {attempt.hasNegativeMark && (
                  <Badge variant="outline" className="text-xs">
                    -{attempt.negativeMark} per wrong
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20">
                    Correct
                  </span>
                  <Progress
                    value={
                      (attempt.correctAnswers / attempt.totalQuestions) * 100
                    }
                    className="flex-1 h-2.5 [&>div]:bg-success"
                  />
                  <span className="text-sm font-medium w-16 text-right">
                    {attempt.correctAnswers}
                    {!attempt.hasNegativeMark && (
                      <span className="text-xs text-success ml-1">
                        (+{attempt.correctAnswers})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20">
                    Wrong
                  </span>
                  <Progress
                    value={
                      (attempt.wrongAnswers / attempt.totalQuestions) * 100
                    }
                    className="flex-1 h-2.5 [&>div]:bg-destructive"
                  />
                  <span className="text-sm font-medium w-16 text-right">
                    {attempt.wrongAnswers}
                    {hasPenalty && (
                      <span className="text-xs text-destructive ml-1">
                        (-{penalty.toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20">
                    Skipped
                  </span>
                  <Progress
                    value={
                      (attempt.skippedQuestions / attempt.totalQuestions) * 100
                    }
                    className="flex-1 h-2.5"
                  />
                  <span className="text-sm font-medium w-16 text-right">
                    {attempt.skippedQuestions}
                  </span>
                </div>
              </div>

              {/* ✅ Score Calculation Summary */}
              {attempt.hasNegativeMark && (
                <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base score:</span>
                    <span className="font-medium">+{scoreWithoutPenalty}</span>
                  </div>
                  {hasPenalty && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Penalty:</span>
                      <span className="font-medium text-destructive">
                        -{penalty.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                    <span>Final Score:</span>
                    <span>{attempt.score.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Best Streak Card */}
            {attempt.bestStreak > 0 && (
              <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                    <p className="text-2xl font-bold text-foreground">
                      {attempt.bestStreak} in a row!
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Review Questions */}
          <ReviewAnswersSection
            reviewQuestions={reviewQuestions}
            correctCount={attempt.correctAnswers}
            wrongCount={attempt.wrongAnswers}
            skippedCount={attempt.skippedQuestions}
          />
        </div>
      </div>
    </>
  );
};

// Separate Header Component for cleaner code
function ResultHeader({
  onBack,
  examTitle,
  onDownload,
  onShare,
}: {
  onBack: () => void;
  examTitle?: string;
  onDownload?: () => void;
  onShare?: () => void;
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
        {onDownload && onShare && (
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
