"use client";

import { use } from "react";
import { useTRPC } from "@/trpc/react";
import {
  Loader2,
  XCircle,
  Trophy,
  Target,
  Clock,
  AlertTriangle,
  BarChart3,
  ListOrdered,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { ReviewAnswersSection } from "@/modules/result/ui/components/review-answers";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface PublicResultPageProps {
  params: Promise<{ id: string; attemptId: string }>;
}

export default function PublicResultPage({ params }: PublicResultPageProps) {
  const { id, attemptId } = use(params);
  const router = useRouter();
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery(
    trpc.public?.exam?.getPublicResult.queryOptions({ attemptId }) || {
      queryKey: ["publicResult", attemptId],
      queryFn: async () => null,
    },
  );

  const attempt = data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">
            Calculating your result...
          </p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md px-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Result Not Found</h2>
          <p className="text-muted-foreground">
            {(error as any)?.message ||
              "We couldn't find the result you're looking for."}
          </p>
          <Button
            onClick={() => router.push(`/public/exams/${id}`)}
            className="w-full"
          >
            Back to Exam
          </Button>
        </div>
      </div>
    );
  }

  const percentage = (attempt.score / attempt.exam.total) * 100;

  // Map database answer history to ReviewQuestion type for the component
  const reviewQuestions = attempt.answerHistory.map((ah: any) => ({
    id: ah.id,
    questionNumber: ah.questionNumber,
    selectedOption: ah.selectedOption,
    correctAnswer: ah.correctAnswer,
    isCorrect: ah.isCorrect,
    timeSpent: ah.timeSpent,
    mcq: {
      id: ah.mcq.id,
      question: ah.mcq.question,
      options: ah.mcq.options,
      answer: ah.mcq.answer,
      explanation: ah.mcq.explanation,
      subject: ah.mcq.subject.name,
      chapter: ah.mcq.chapter.name,
      type: ah.mcq.type,
      isMath: ah.mcq.isMath,
      context: ah.mcq.context,
      statements: ah.mcq.statements,
      timeSpent: ah.timeSpent, // Required by MCQData type
    },
  }));

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Result Header Card */}
        <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  <Trophy className="w-4 h-4" />
                  Exam Completed
                </div>
                <h1 className="text-3xl md:text-5xl font-black">
                  Great job, {attempt.participant.name}!
                </h1>
                <p className="text-primary-foreground/80 max-w-lg text-lg">
                  You have completed the{" "}
                  <span className="font-bold text-white">
                    &quot;{attempt.exam.title}&quot;
                  </span>{" "}
                  entrance exam. Below is your detailed performance analysis.
                </p>
              </div>

              {/* Score Display */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all"></div>
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-white/20 flex items-center justify-center flex-col bg-white/10 backdrop-blur-md shadow-2xl">
                  <span className="text-5xl md:text-7xl font-black">
                    {attempt.score}
                  </span>
                  <span className="text-sm md:text-base font-bold opacity-80 uppercase tracking-widest mt-1">
                    Out of {attempt.exam.total}
                  </span>
                  <div className="absolute -bottom-2 bg-success text-success-foreground px-4 py-1 rounded-full text-sm font-black shadow-lg">
                    {percentage.toFixed(1)}% Score
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Target className="w-6 h-6 text-success" />}
            label="Accuracy"
            value={`${((attempt.correctAnswers / (attempt.answeredCount || 1)) * 100).toFixed(0)}%`}
            subValue={`${attempt.correctAnswers} Correct Answers`}
            className="bg-success/5"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-primary" />}
            label="Questions"
            value={attempt.answeredCount.toString()}
            subValue={`Out of ${attempt.totalQuestions}`}
            className="bg-primary/5"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-blue-500" />}
            label="Duration"
            value={`${Math.floor((attempt.duration || 0) / 60)}m ${(attempt.duration || 0) % 60}s`}
            subValue="Time taken"
            className="bg-blue-500/5"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6 text-destructive" />}
            label="Mistakes"
            value={attempt.wrongAnswers.toString()}
            subValue={`${attempt.skippedQuestions} Skipped`}
            className="bg-destructive/5"
          />
        </div>

        {/* Detailed Review Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-2 border-none shadow-sm h-full pt-4">
            <CardContent>
              <ReviewAnswersSection
                reviewQuestions={reviewQuestions}
                correctCount={attempt.correctAnswers}
                wrongCount={attempt.wrongAnswers}
                skippedCount={attempt.skippedQuestions}
              />
            </CardContent>
          </Card>

          {/* Participant Info Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg">Participant Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <InfoRow label="Name" value={attempt.participant.name} />
                <InfoRow label="Class" value={attempt.participant.class} />
                <InfoRow label="College" value={attempt.participant.college} />
                <InfoRow
                  label="Phone"
                  value={"******" + attempt.participant.phone.slice(-4)}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-muted/50">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl">Ready for the real deal?</h3>
                <p className="text-sm text-muted-foreground">
                  Create a full student profile to track all your exams,
                  participate in weekly contests, and join our regular classes.
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/auth/signup")}
                >
                  Register as Student
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-none shadow-sm overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <h4 className="text-2xl font-black">{value}</h4>
            <p className="text-xs text-muted-foreground font-medium">
              {subValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-muted last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
