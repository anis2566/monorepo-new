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
} from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

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
}

interface ResultCardProps {
  result: Result;
}

export function ResultCard({ result }: ResultCardProps) {
  const router = useRouter();

  const getScoreColor = () => {
    if (result.percentage >= 80) return "text-success";
    if (result.percentage >= 60) return "text-warning";
    return "text-destructive";
  };

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

  const getGradeColor = () => {
    if (result.percentage >= 80)
      return "bg-success/20 text-success border-success/30";
    if (result.percentage >= 60)
      return "bg-warning/20 text-warning border-warning/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  const getPerformanceLabel = () => {
    if (result.percentage >= 90) return "Excellent!";
    if (result.percentage >= 80) return "Great Job!";
    if (result.percentage >= 60) return "Good Work";
    return "Keep Trying";
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
            </div>
          </div>
          <div className="flex-shrink-0">{getScoreIcon()}</div>
        </div>

        {/* Score Display */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div
              className={cn("text-4xl lg:text-5xl font-bold", getScoreColor())}
            >
              {result.percentage.toFixed(0)}
              <span className="text-2xl">%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel()}
            </p>
          </div>
          <div className="text-right">
            <Badge
              className={cn("font-bold text-sm border mb-2", getGradeColor())}
            >
              {result.grade}
            </Badge>
            <p className="text-sm font-medium text-foreground">
              {result.score.toFixed(1)}/{result.total}
            </p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
        </div>

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
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-1 mb-1">
              <XCircle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-sm font-bold text-destructive">
                {result.incorrect}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Wrong</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <MinusCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                {result.skipped}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Skipped</span>
          </div>
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
