"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { BookOpen, Trophy, Medal, Award } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";

interface ExamAttempt {
  id: string;
  examTitle: string;
  examType: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  duration: number;
  status: string;
  createdAt: string;
  meritRank: number | null;
  totalParticipants: number;
}

interface StudentExamHistoryProps {
  attempts: ExamAttempt[];
}

export function StudentExamHistory({ attempts }: StudentExamHistoryProps) {
  const getAttemptStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Submitted
          </Badge>
        );
      case "Auto-TimeUp":
      case "Auto-TabSwitch":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Auto-Submitted
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMeritRankBadge = (rank: number | null, total: number) => {
    if (!rank || rank <= 0) return null;

    let icon = null;
    let className = "";

    if (rank === 1) {
      icon = <Trophy className="h-3 w-3" />;
      className = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    } else if (rank === 2) {
      icon = <Medal className="h-3 w-3" />;
      className = "bg-gray-400/10 text-gray-600 border-gray-400/20";
    } else if (rank === 3) {
      icon = <Award className="h-3 w-3" />;
      className = "bg-amber-600/10 text-amber-600 border-amber-600/20";
    } else {
      className = "bg-muted text-muted-foreground border-border";
    }

    return (
      <Badge variant="outline" className={cn("gap-1", className)}>
        {icon}#{rank}/{total}
      </Badge>
    );
  };

  if (attempts.length === 0) {
    return (
      <Card className="shadow-card p-8">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No exam attempts yet</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Merit Rank</TableHead>
              <TableHead>Correct</TableHead>
              <TableHead>Wrong</TableHead>
              <TableHead>Skipped</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {attempt.examTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {attempt.examType}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({attempt.percentage}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getMeritRankBadge(
                    attempt.meritRank,
                    attempt.totalParticipants
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-success">{attempt.correctAnswers}</span>
                </TableCell>
                <TableCell>
                  <span className="text-destructive">
                    {attempt.wrongAnswers}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {attempt.skippedQuestions}
                  </span>
                </TableCell>
                <TableCell>{attempt.duration} min</TableCell>
                <TableCell>{getAttemptStatusBadge(attempt.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(attempt.createdAt), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {attempts.map((attempt) => (
          <Card key={attempt.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{attempt.examTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(attempt.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              {getAttemptStatusBadge(attempt.status)}
            </div>

            {/* Merit Rank */}
            {attempt.meritRank && (
              <div className="mb-3">
                {getMeritRankBadge(
                  attempt.meritRank,
                  attempt.totalParticipants
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">
                  {attempt.percentage}%
                </p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div>
                <p className="text-lg font-bold text-success">
                  {attempt.correctAnswers}
                </p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-lg font-bold text-destructive">
                  {attempt.wrongAnswers}
                </p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
