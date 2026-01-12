import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  Flame,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { ExamAttempt } from "@workspace/db";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";
import { Pagination } from "./pagination";
import { differenceInSeconds, formatDuration } from "date-fns";
import Link from "next/link";

interface ResultWithRelation extends ExamAttempt {
  student: {
    name: string;
    studentId: string;
  };
  exam: {
    title: string;
  };
}

interface ResultListProps {
  results: ResultWithRelation[];
  totalCount: number;
}

const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Submitted: "bg-success/10 text-success border-success/20",
  "Auto-Submitted": "bg-warning/10 text-warning border-warning/20",
  Abandoned: "bg-destructive/10 text-destructive border-destructive/20",
};

export const ResultList = ({ results, totalCount }: ResultListProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Exam Attempts ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden xl:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((attempt) => {
                const percentage = Math.round(
                  (attempt.score / attempt.totalQuestions) * 100
                );
                return (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{attempt.student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.student.studentId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground">
                      {attempt.exam.title}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {attempt.score}/{attempt.totalQuestions}
                        <span className="text-muted-foreground font-normal ml-1">
                          ({percentage}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-success flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {attempt.correctAnswers}
                        </span>
                        <span className="text-destructive">
                          ✗ {attempt.wrongAnswers}
                        </span>
                        <span className="text-muted-foreground">
                          ○ {attempt.skippedQuestions}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(
                          {
                            hours: Math.floor(
                              differenceInSeconds(
                                attempt.endTime ?? new Date(),
                                attempt.startTime ?? new Date()
                              ) / 3600
                            ),
                            minutes: Math.floor(
                              (differenceInSeconds(
                                attempt.endTime ?? new Date(),
                                attempt.startTime ?? new Date()
                              ) %
                                3600) /
                                60
                            ),
                            seconds:
                              differenceInSeconds(
                                attempt.endTime ?? new Date(),
                                attempt.startTime ?? new Date()
                              ) % 60,
                          },
                          {
                            format: ["hours", "minutes", "seconds"],
                            delimiter: " ",
                          }
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[attempt.status]}
                      >
                        {attempt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {attempt.tabSwitches > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {attempt.tabSwitches}
                          </Badge>
                        )}
                        {attempt.bestStreak >= 5 && (
                          <Badge
                            variant="outline"
                            className="bg-warning/10 text-warning border-warning/20 text-xs"
                          >
                            <Flame className="h-3 w-3 mr-1" />
                            {attempt.bestStreak}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={`/results/${attempt.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="xl:hidden space-y-3">
          {results.map((attempt) => {
            const percentage = Math.round(
              (attempt.score / attempt.totalQuestions) * 100
            );
            return (
              <MobileDataCard key={attempt.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{attempt.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {attempt.student.studentId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {attempt.exam.title}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link href={`/results/${attempt.id}`}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={statusColors[attempt.status]}
                  >
                    {attempt.status}
                  </Badge>
                  {attempt.tabSwitches > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {attempt.tabSwitches} switches
                    </Badge>
                  )}
                  {attempt.bestStreak >= 5 && (
                    <Badge
                      variant="outline"
                      className="bg-warning/10 text-warning border-warning/20 text-xs"
                    >
                      <Flame className="h-3 w-3 mr-1" />
                      {attempt.bestStreak} streak
                    </Badge>
                  )}
                </div>
                <MobileDataRow
                  label="Score"
                  value={
                    <span className="font-semibold">
                      {attempt.score}/{attempt.totalQuestions} ({percentage}%)
                    </span>
                  }
                />
                <MobileDataRow
                  label="Performance"
                  value={
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-success">
                        ✓{attempt.correctAnswers}
                      </span>
                      <span className="text-destructive">
                        ✗{attempt.wrongAnswers}
                      </span>
                      <span className="text-muted-foreground">
                        ○{attempt.skippedQuestions}
                      </span>
                    </div>
                  }
                />
                <MobileDataRow
                  label="Duration"
                  value={`${attempt.duration} min`}
                />
              </MobileDataCard>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
