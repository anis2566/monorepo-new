"use client";

import { ResultCard } from "@/components/result-card";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Trophy,
  Loader2,
  Calendar,
  BarChart3,
  Filter,
} from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { cn } from "@workspace/ui/lib/utils";

export const ResultView = () => {
  const trpc = useTRPC();
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const [sortBy, setSortBy] = useState<"recent" | "score">("recent");

  // Fetch results
  const { data: results, isLoading } = useSuspenseQuery(
    trpc.student.result.getResults.queryOptions()
  );

  // Filter and sort results
  const filteredResults = useMemo(() => {
    if (!results) return [];

    let filtered = [...results];

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (timeFilter === "week") {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeFilter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      }

      filtered = filtered.filter((r) => new Date(r.completedAt) >= cutoffDate);
    }

    // Sort
    if (sortBy === "score") {
      filtered.sort((a, b) => b.percentage - a.percentage);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    }

    return filtered;
  }, [results, timeFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!results || results.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        totalExams: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        improvementRate: 0,
        recentAverage: 0,
      };
    }

    const averageScore = Math.round(
      results.reduce((acc, r) => acc + r.percentage, 0) / results.length
    );

    const bestScore = Math.max(...results.map((r) => r.percentage));
    const totalCorrect = results.reduce((acc, r) => acc + r.correct, 0);
    const totalQuestions = results.reduce((acc, r) => acc + r.total, 0);

    // Calculate improvement (compare first 3 vs last 3 exams)
    let improvementRate = 0;
    if (results.length >= 6) {
      const recent3 = results.slice(0, 3);
      const older3 = results.slice(-3);
      const recentAvg = recent3.reduce((acc, r) => acc + r.percentage, 0) / 3;
      const olderAvg = older3.reduce((acc, r) => acc + r.percentage, 0) / 3;
      improvementRate = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
    }

    // Recent average (last 5 exams)
    const recentExams = results.slice(0, Math.min(5, results.length));
    const recentAverage = Math.round(
      recentExams.reduce((acc, r) => acc + r.percentage, 0) / recentExams.length
    );

    return {
      averageScore,
      bestScore,
      totalExams: results.length,
      totalCorrect,
      totalQuestions,
      improvementRate,
      recentAverage,
    };
  }, [results]);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  if (!results || results.length === 0) {
    return (
      <>
        <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete your first exam to see your results here
            </p>
            <Button onClick={() => (window.location.href = "/exams")}>
              Browse Exams
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl mx-auto space-y-6">
      {/* Stats Overview - Desktop */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          value={`${stats.recentAverage}%`}
          label="Recent Average"
          sublabel="Last 5 exams"
          iconBg="bg-primary/10"
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-success" />}
          value={`${stats.bestScore.toFixed(0)}%`}
          label="Best Score"
          sublabel="Personal record"
          iconBg="bg-success/10"
          valueColor="text-success"
        />
        <StatsCard
          icon={<Target className="w-6 h-6 text-accent" />}
          value={stats.totalExams.toString()}
          label="Exams Taken"
          sublabel={`${stats.totalCorrect}/${stats.totalQuestions} correct`}
          iconBg="bg-accent/10"
        />
        <StatsCard
          icon={<Zap className="w-6 h-6 text-warning" />}
          value={
            stats.improvementRate !== 0
              ? `${stats.improvementRate > 0 ? "+" : ""}${stats.improvementRate}%`
              : "N/A"
          }
          label="Improvement"
          sublabel="vs earlier exams"
          iconBg="bg-warning/10"
          valueColor={
            stats.improvementRate > 0
              ? "text-success"
              : stats.improvementRate < 0
                ? "text-destructive"
                : "text-foreground"
          }
        />
      </div>

      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {stats.recentAverage}%
          </p>
          <p className="text-xs text-muted-foreground">Recent Avg</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {stats.bestScore.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground">Best Score</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">
              Showing {filteredResults.length} of {results.length} results
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time Filter */}
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setTimeFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  timeFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  timeFilter === "month"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  timeFilter === "week"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                This Week
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 text-sm border-l pl-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setSortBy("recent")}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  sortBy === "recent"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy("score")}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  sortBy === "score"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                Top Score
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Grid */}
      <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-12 text-center text-muted-foreground">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-medium text-lg">No results found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  iconBg: string;
  valueColor?: string;
}

function StatsCard({
  icon,
  value,
  label,
  sublabel,
  iconBg,
  valueColor = "text-foreground",
}: StatsCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            iconBg
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-3xl font-bold truncate", valueColor)}>
            {value}
          </p>
          <p className="text-sm font-medium text-foreground truncate">
            {label}
          </p>
          <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
        </div>
      </div>
    </Card>
  );
}
