import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { format } from "date-fns";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  MinusCircle,
  Target,
} from "lucide-react";

interface ExamOverviewProps {
  exam: {
    type: string;
    total: number;
    duration: number;
    mcq: number | null;
    hasNegativeMark: boolean;
    negativeMark: number;
    hasShuffle: boolean;
    hasRandom: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    subjects: string[];
    chapters: string[];
    classes: string[];
    batches: string[];
  };
  stats: {
    highestScore: number;
    lowestScore: number;
    avgScore: number;
    tabSwitchViolations: number;
  };
}

export const ExamOverviw = ({ exam, stats }: ExamOverviewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Exam Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Exam Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-x-6">
            <InfoRow label="Exam Type" value={exam.type} icon={BookOpen} />
            <InfoRow label="Total Marks" value={exam.total} icon={Target} />
            <InfoRow
              label="Duration"
              value={`${exam.duration} minutes`}
              icon={Clock}
            />
            <InfoRow label="MCQ Count" value={exam.mcq} icon={ListChecks} />
            <InfoRow
              label="Negative Marking"
              value={
                exam.hasNegativeMark
                  ? `Yes (${exam.negativeMark} per wrong)`
                  : "No"
              }
              icon={exam.hasNegativeMark ? MinusCircle : CheckCircle2}
            />
            <InfoRow
              label="Shuffle Options"
              value={exam.hasShuffle ? "Enabled" : "Disabled"}
              icon={CheckCircle2}
            />
            <InfoRow
              label="Random Questions"
              value={exam.hasRandom ? "Enabled" : "Disabled"}
              icon={CheckCircle2}
            />
          </CardContent>
        </Card>

        {/* Schedule & Scope */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule & Scope
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-x-6">
              <InfoRow
                label="Start Date"
                value={format(exam.startDate, "PPP p")}
                icon={Calendar}
              />
              <InfoRow
                label="End Date"
                value={format(exam.endDate, "PPP p")}
                icon={Calendar}
              />
              <InfoRow
                label="Created At"
                value={format(exam.createdAt, "PPP")}
              />
            </div>

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground mb-2">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {exam.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Chapters</p>
              <div className="flex flex-wrap gap-1">
                {exam.chapters.map((chapter, index) => (
                  <Badge key={index} variant="outline">
                    {chapter}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Target Classes
              </p>
              <div className="flex flex-wrap gap-1">
                {exam.classes.map((cls, index) => (
                  <Badge key={index} variant="outline">
                    {cls}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Target Batches
              </p>
              <div className="flex flex-wrap gap-1">
                {exam.batches.map((batch, index) => (
                  <Badge key={index} variant="outline">
                    {batch}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats?.highestScore || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Highest Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats?.lowestScore || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Lowest Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats?.avgScore || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">
                {stats?.tabSwitchViolations || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Tab Switch Violations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && (
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}
