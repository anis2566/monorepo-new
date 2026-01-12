"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Users,
  BookOpen,
  Target,
  Trophy,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface BatchStatsProps {
  stats: {
    totalStudents: number;
    totalExams: number;
    activeExams: number;
    avgScore: number;
    passRate: number;
    totalAttempts: number;
  };
}

export function BatchStats({ stats }: BatchStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalStudents}
              </p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Exams</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalExams}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.activeExams} active
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.avgScore}%
              </p>
              <div
                className={`flex items-center gap-1 text-xs ${
                  stats.avgScore >= 50 ? "text-success" : "text-destructive"
                }`}
              >
                {stats.avgScore >= 50 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stats.avgScore >= 50 ? "Above average" : "Below average"}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Pass Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.passRate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.totalAttempts} attempts
              </p>
            </div>
            <div
              className={`p-2 rounded-lg ${
                stats.passRate >= 70
                  ? "bg-success/10"
                  : stats.passRate >= 40
                    ? "bg-warning/10"
                    : "bg-destructive/10"
              }`}
            >
              <Trophy
                className={`h-5 w-5 ${
                  stats.passRate >= 70
                    ? "text-success"
                    : stats.passRate >= 40
                      ? "text-warning"
                      : "text-destructive"
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
