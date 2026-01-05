"use client";

import { Clock, BookOpen, Calendar, AlertTriangle, Play } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useRouter } from "next/navigation";
import { Exam } from "@workspace/db";
import { useStartExam } from "@/hooks/use-exam";

interface ExamWithRelation extends Exam {
  subjects: {
    subject: {
      name: string;
    };
  }[];
}

interface ExamCardProps {
  exam: ExamWithRelation;
  variant?: "default" | "compact";
  totalQuestions: number;
}

export function ExamCard({
  exam,
  variant = "default",
  totalQuestions,
}: ExamCardProps) {
  // ✅ CHANGED: Use setExamData instead of onOpen
  const { setExamData } = useStartExam();
  const router = useRouter();

  const now = new Date();
  const isUpcoming = isBefore(now, exam.startDate);
  const isActive = isAfter(now, exam.startDate) && isBefore(now, exam.endDate);
  const isExpired = isAfter(now, exam.endDate);

  // ✅ CHANGED: Call setExamData to open modal
  const handleClick = () => {
    setExamData(exam.id, totalQuestions);
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Expired
        </Badge>
      );
    }
    if (isActive) {
      return (
        <Badge className="bg-success text-success-foreground animate-pulse-soft">
          Live Now
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-warning text-warning">
        Upcoming
      </Badge>
    );
  };

  const getTimeInfo = () => {
    if (isExpired) return "Exam ended";
    if (isActive)
      return `Ends ${formatDistanceToNow(exam.endDate, { addSuffix: true })}`;
    return `Starts ${formatDistanceToNow(exam.startDate, { addSuffix: true })}`;
  };

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
          isActive && "border-success/50 bg-success/5"
        )}
        onClick={() => isActive && handleClick()}
      >
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">{getStatusBadge()}</div>
          <h3 className="font-semibold text-foreground truncate">
            {exam.title}
          </h3>
          <p className="text-sm text-muted-foreground">{getTimeInfo()}</p>
        </div>
        {isActive && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Play className="w-4 h-4" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 lg:p-6 space-y-4 shadow-card transition-all duration-300 hover:shadow-lg animate-fade-in",
        isActive && "border-success/50 bg-success/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">{getStatusBadge()}</div>
          <h3 className="font-semibold text-foreground text-lg line-clamp-2">
            {exam.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{getTimeInfo()}</p>
        </div>
        <div className="hidden lg:flex w-14 h-14 rounded-xl gradient-primary items-center justify-center flex-shrink-0">
          <BookOpen className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 lg:gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{exam.mcq} MCQs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{exam.duration} mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{format(exam.startDate, "MMM d, h:mm a")}</span>
        </div>
      </div>

      {exam.hasNegativeMark && (
        <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 px-3 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span>Negative marking: -{exam.negativeMark} per wrong answer</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex gap-2 flex-wrap">
          {exam.subjects.map((subject) => (
            <Badge
              key={subject.subject.name}
              variant="secondary"
              className="text-xs"
            >
              {subject.subject.name}
            </Badge>
          ))}
        </div>

        <Button
          variant={isActive ? "default" : "outline"}
          disabled={isExpired || isUpcoming}
          onClick={handleClick}
          className="flex-shrink-0"
        >
          {isActive
            ? "Start Exam"
            : isUpcoming
              ? "Not Available"
              : "View Details"}
        </Button>
      </div>
    </Card>
  );
}
