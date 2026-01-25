"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Clock, MoreHorizontal, Users } from "lucide-react";
import { format } from "date-fns";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";

interface ExamAttempt {
  id: string;
  phone: string;
  studentName: string;
  status: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  duration: number;
  tabSwitches: number;
  endTime: string | null;
}

interface PublicExamAttemptsTableProps {
  attempts: ExamAttempt[];
  totalItems: number;
}

const attemptStatusColors: Record<string, string> = {
  Submitted: "bg-success/10 text-success border-success/20",
  "Auto-TimeUp": "bg-warning/10 text-warning border-warning/20",
  "Auto-TabSwitch": "bg-warning/10 text-warning border-warning/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Abandoned: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PublicExamAttemptsTable({
  attempts,
  totalItems,
}: PublicExamAttemptsTableProps) {
  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Student Attempts ({totalItems})
          </CardTitle>
          <CardDescription>All attempts for this examination</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Correct/Wrong/Skip</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tab Switches</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{attempt.studentName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {attempt.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={attemptStatusColors[attempt.status]}>
                        {attempt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{attempt.score}</span>
                        <span className="text-muted-foreground">
                          / {attempt.totalQuestions}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {Math.round(
                            (attempt.score / attempt.totalQuestions) * 100,
                          )}
                          %)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">
                          {attempt.correctAnswers}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-600">
                          {attempt.wrongAnswers}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">
                          {attempt.skippedQuestions}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {attempt.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      {attempt.tabSwitches > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-warning border-warning/20 bg-warning/10"
                        >
                          {attempt.tabSwitches}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          0
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {attempt.endTime
                        ? format(attempt.endTime, "MMM d, h:mm a")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Answer Sheet</DropdownMenuItem>
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {attempts.map((attempt) => (
              <MobileDataCard key={attempt.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {attempt.phone}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Student</DropdownMenuItem>
                      <DropdownMenuItem>View Answer Sheet</DropdownMenuItem>
                      <DropdownMenuItem>Download Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={attemptStatusColors[attempt.status]}>
                    {attempt.status}
                  </Badge>
                  {attempt.tabSwitches > 0 && (
                    <Badge
                      variant="outline"
                      className="text-warning border-warning/20 bg-warning/10"
                    >
                      {attempt.tabSwitches} switches
                    </Badge>
                  )}
                </div>
                <MobileDataRow
                  label="Score"
                  value={`${attempt.score}/${attempt.totalQuestions} (${Math.round((attempt.score / attempt.totalQuestions) * 100)}%)`}
                />
                <MobileDataRow
                  label="Answers"
                  value={
                    <span>
                      <span className="text-green-600">
                        {attempt.correctAnswers}✓
                      </span>{" "}
                      <span className="text-red-600">
                        {attempt.wrongAnswers}✗
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {attempt.skippedQuestions} skip
                      </span>
                    </span>
                  }
                />
                <MobileDataRow
                  label="Duration"
                  value={`${attempt.duration} min`}
                />
              </MobileDataCard>
            ))}
          </div>

          {attempts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No attempts yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
