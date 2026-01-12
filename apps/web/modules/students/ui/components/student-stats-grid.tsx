"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";

interface StudentStatsGridProps {
  stats: {
    totalExams: number;
    avgScore: number;
    passRate: number;
    bestScore: number;
  };
}

export function StudentStatsGrid({ stats }: StudentStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Exams</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalExams}
              </p>
              <p className="text-xs text-muted-foreground">Participated</p>
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
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                +5% from last month
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
                {Math.round((stats.passRate * stats.totalExams) / 100)} passed
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Best Score</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.bestScore}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
