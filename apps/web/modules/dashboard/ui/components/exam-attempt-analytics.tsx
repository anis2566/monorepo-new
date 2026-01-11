import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Target, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@workspace/ui/components/progress";

interface AttemptAnalyticsProps {
  data: {
    totalAttempts: number;
    inProgress: number;
    completed: number;
    autoSubmitted: number;
    avgDuration: number;
    tabSwitchViolations: number;
  };
}

export function ExamAttemptAnalytics({ data }: AttemptAnalyticsProps) {
  const completionRate = ((data.completed / data.totalAttempts) * 100).toFixed(
    1
  );
  const violationRate = (
    (data.tabSwitchViolations / data.totalAttempts) *
    100
  ).toFixed(1);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Exam Attempts Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-success/10 rounded-lg p-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-bold text-foreground">
                  {data.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-warning/10 rounded-lg p-2">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-lg font-bold text-foreground">
                  {data.inProgress}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-destructive/10 rounded-lg p-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Auto-Submitted</p>
                <p className="text-lg font-bold text-foreground">
                  {data.autoSubmitted}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 rounded-lg p-2">
                <Target className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
                <p className="text-lg font-bold text-foreground">
                  {data.avgDuration}m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-semibold text-foreground">
              {completionRate}%
            </span>
          </div>
          <Progress value={parseFloat(completionRate)} className="h-2" />
        </div>

        {/* Violations Alert */}
        {data.tabSwitchViolations > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  {data.tabSwitchViolations} Tab Switch Violations
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {violationRate}% of attempts had suspicious activity
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
