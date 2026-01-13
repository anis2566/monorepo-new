"use client";

import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
  Flame,
  TrendingUp,
  Award,
  ListOrdered,
  Loader2,
} from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface Result {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  percentage: number;
  grade: string;
  timeTaken: number;
  completedAt: Date;
  status: string;
  submissionType: string | null;
  subjects: string[];
  // ✅ Negative marking fields
  hasNegativeMark: boolean;
  negativeMark: number;
  endTime: string;
}

interface ResultCardProps {
  result: Result;
}

export function ResultCard({ result }: ResultCardProps) {
  const router = useRouter();

  // ✅ Calculate penalty if negative marking is enabled
  const penalty = result.hasNegativeMark
    ? result.incorrect * result.negativeMark
    : 0;
  const scoreWithoutPenalty = result.correct;

  const [examEnded, setExamEnded] = useState(false);
  const [timeUntilEnd, setTimeUntilEnd] = useState<string>("");

  // Check exam end status
  useEffect(() => {
    const endTime = new Date(result.endTime);

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
  }, [result.endTime]);

  const getGradientColor = () => {
    if (result.percentage >= 80)
      return "from-success/20 via-success/10 to-transparent";
    if (result.percentage >= 60)
      return "from-warning/20 via-warning/10 to-transparent";
    return "from-destructive/20 via-destructive/10 to-transparent";
  };

  const getScoreIcon = () => {
    if (result.percentage >= 90)
      return <Trophy className="w-5 h-5 text-amber-500" />;
    if (result.percentage >= 80)
      return <Award className="w-5 h-5 text-success" />;
    if (result.percentage >= 60)
      return <TrendingUp className="w-5 h-5 text-warning" />;
    return <Flame className="w-5 h-5 text-destructive" />;
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "p-5 lg:p-6",
        "shadow-sm hover:shadow-xl",
        "transition-all duration-300",
        "cursor-pointer",
        "border-2 hover:border-primary/50",
        "animate-fade-in"
      )}
      onClick={() => router.push(`/results/${result.id}`)}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity",
          getGradientColor()
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-foreground text-base lg:text-lg line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {result.examTitle}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(new Date(result.completedAt), {
                  addSuffix: true,
                })}
              </span>
              <span>•</span>
              <span>{format(new Date(result.completedAt), "MMM d, yyyy")}</span>
              {/* ✅ Negative marking indicator */}
              {result.hasNegativeMark && (
                <>
                  <span>•</span>
                  <span className="text-destructive font-medium">
                    -{result.negativeMark} penalty
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">{getScoreIcon()}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-600">Total Marks</h3>
            <p className="text-3xl font-bold text-blue-900">
              {scoreWithoutPenalty}
            </p>
          </div>

          <div className="bg-green-50 p-2 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-600">
              Obtained Marks
            </h3>
            <p className="text-3xl font-bold text-green-900">{result.score}</p>
          </div>
        </div>

        {/* ✅ Negative Marking Warning (if penalty applied) */}
        {examEnded ? (
          <Button
            variant="default"
            size="sm"
            className="w-full mb-4 mt-2"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/exams/merit/${result.examId}`}>
              <ListOrdered className="w-4 h-4 mr-2" />
              View Merit List
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="gap-2 mt-2 mb-4 w-full"
          >
            <Loader2 className="w-4 w-4 animate-spin" />
            <span className="text-xs">{timeUntilEnd}</span>
          </Button>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span className="text-sm font-bold text-success">
                {result.correct}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Correct</span>
            {/* ✅ Show points if no negative marking */}
            {!result.hasNegativeMark && (
              <span className="text-xs text-success mt-0.5">
                +{result.correct}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-1 mb-1">
              <XCircle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-sm font-bold text-destructive">
                {result.incorrect}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Wrong</span>
            {/* ✅ Show penalty if negative marking */}
            {result.hasNegativeMark && result.incorrect > 0 && (
              <span className="text-xs text-destructive mt-0.5">
                -{penalty.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <MinusCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                {result.skipped}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Skipped</span>
            <span className="text-xs text-muted-foreground mt-0.5">0</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {result?.subjects.map((subject, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn("text-xs border")}
            >
              {subject}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{result.timeTaken} mins</span>
          </div>

          {/* Submission Type Badge */}
          {result.submissionType && result.submissionType !== "Manual" && (
            <Badge variant="outline" className="text-xs">
              Auto-submitted
            </Badge>
          )}

          <div className="flex items-center gap-1.5 text-primary font-semibold group-hover:gap-2.5 transition-all">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-lg transition-colors pointer-events-none" />
    </Card>
  );
}
