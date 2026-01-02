"use client";

import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
} from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { ExamResult } from "@/types/exam";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ResultCardProps {
  result: ExamResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const router = useRouter();

  const getScoreColor = () => {
    if (result.percentage >= 80) return "text-success";
    if (result.percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreEmoji = () => {
    if (result.percentage >= 90) return "🏆";
    if (result.percentage >= 80) return "🌟";
    if (result.percentage >= 60) return "👍";
    return "📚";
  };

  return (
    <Card
      className="p-4 shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={() => router.push(`/result/${result.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {result.examTitle}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {format(result.completedAt, "MMM d, yyyy • h:mm a")}
          </p>
        </div>
        <div className="text-2xl">{getScoreEmoji()}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={cn("text-3xl font-bold", getScoreColor())}>
          {result.percentage.toFixed(0)}%
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {result.score}/{result.total}
          </p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">
            {result.correct} correct
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">
            {result.incorrect} wrong
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <MinusCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {result.skipped} skipped
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{result.timeTaken} mins</span>
        </div>
        <div className="flex items-center gap-1 text-primary font-medium">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}
