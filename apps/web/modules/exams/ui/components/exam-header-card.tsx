"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { FileText, Clock, ListChecks } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ExamHeaderCardProps {
  exam: {
    id: string;
    title: string;
    type: string;
    status: string;
    duration: number;
    total: number;
    subjects: string[];
    batches: string[];
    startDate: string;
    endDate: string;
  };
}

const statusColors: Record<string, string> = {
  Ongoing: "bg-success/10 text-success border-success/20",
  Upcoming: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function ExamHeaderCard({ exam }: ExamHeaderCardProps) {
  const getTimeRemaining = () => {
    const now = new Date();
    const start = new Date(exam.startDate);
    const end = new Date(exam.endDate);

    if (exam.status === "Ongoing") {
      return `Ends ${formatDistanceToNow(end, { addSuffix: true })}`;
    }
    if (exam.status === "Upcoming") {
      return `Starts ${formatDistanceToNow(start, { addSuffix: true })}`;
    }
    return "Completed";
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      <CardContent className="pt-0 -mt-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 shadow-lg">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {exam.title}
                </h2>
                <Badge className={statusColors[exam.status]}>
                  {exam.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{exam.type}</Badge>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {exam.duration} min
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <ListChecks className="h-3 w-3" />
                  {exam.total} marks
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Time Status</p>
              <p className="text-sm font-medium text-foreground">
                {getTimeRemaining()}
              </p>
            </div>
          </div>

          {/* Subject and Batch Tags */}
          <div className="flex flex-wrap gap-2">
            {exam.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary">
                {subject}
              </Badge>
            ))}
            <Separator orientation="vertical" className="h-5" />
            {exam.batches.map((batch, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-muted-foreground"
              >
                {batch}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
