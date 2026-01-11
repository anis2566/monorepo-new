"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Target,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";

interface MeritViewProps {
  examId: string;
}

export const MeritView = ({ examId }: MeritViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();

  // Fetch merit list data
  const { data } = useSuspenseQuery(
    trpc.admin.exam.getMeritList.queryOptions({ examId })
  );

  const { exam, meritList } = data;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white border-0";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0";
      default:
        return "";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  // Top 3 for podium
  const topThree = meritList.slice(0, 3);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-foreground">
                Merit List
              </h1>
              <p className="text-sm text-muted-foreground hidden lg:block">
                {exam.title}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:flex gap-1">
            <Trophy className="w-3.5 h-3.5" />
            {exam.totalStudents} Students
          </Badge>
        </div>
      </header>

      <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-5xl mx-auto">
        {/* Exam Info Card */}
        <Card className="p-4 lg:p-6 mb-6 gradient-hero">
          <h2 className="font-semibold text-lg lg:text-xl mb-2">
            {exam.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Total Marks: {exam.total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Avg Score: {exam.avgScore}%</span>
            </div>
          </div>
        </Card>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Performers
            </h3>
            <div className="flex items-end justify-center gap-2 lg:gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-14 h-14 lg:w-18 lg:h-18 mb-2 ring-2 ring-gray-400">
                  <AvatarImage src={topThree[1]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                    {topThree[1]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Medal className="w-6 h-6 text-gray-400 mb-1" />
                <p className="font-medium text-sm text-center line-clamp-1">
                  {topThree[1]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[1]?.percentage.toFixed(0)}%
                </p>
                <div className="w-full h-20 lg:h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2" />
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-16 h-16 lg:w-20 lg:h-20 mb-2 ring-4 ring-yellow-400">
                  <AvatarImage src={topThree[0]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xl">
                    {topThree[0]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Crown className="w-7 h-7 text-yellow-500 mb-1" />
                <p className="font-semibold text-sm text-center line-clamp-1">
                  {topThree[0]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[0]?.percentage.toFixed(0)}%
                </p>
                <div className="w-full h-28 lg:h-32 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg mt-2" />
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-14 h-14 lg:w-18 lg:h-18 mb-2 ring-2 ring-amber-600">
                  <AvatarImage src={topThree[2]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-amber-100 text-amber-600 text-lg">
                    {topThree[2]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Medal className="w-6 h-6 text-amber-600 mb-1" />
                <p className="font-medium text-sm text-center line-clamp-1">
                  {topThree[2]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[2]?.percentage.toFixed(0)}%
                </p>
                <div className="w-full h-16 lg:h-20 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg mt-2" />
              </div>
            </div>
          </div>
        )}

        {/* Full Merit List */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Complete Rankings</h3>
          <div className="space-y-2">
            {meritList.map((entry) => (
              <Card
                key={entry.id}
                className={cn(
                  "p-3 lg:p-4 transition-all hover:shadow-md",
                  entry.rank <= 3 && "border-l-4",
                  entry.rank === 1 && "border-l-yellow-400",
                  entry.rank === 2 && "border-l-gray-400",
                  entry.rank === 3 && "border-l-amber-600"
                )}
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Rank */}
                  <div
                    className={cn(
                      "w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm lg:text-base",
                      entry.rank <= 3
                        ? getRankBadgeColor(entry.rank)
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {getRankIcon(entry.rank) || `#${entry.rank}`}
                  </div>

                  {/* Avatar & Name */}
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                    <AvatarImage src={entry.imageUrl || undefined} />
                    <AvatarFallback className="bg-muted">
                      {entry.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {entry.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.className} • Roll: {entry.roll}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg lg:text-xl font-bold",
                        getScoreColor(entry.percentage)
                      )}
                    >
                      {entry.percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.score}/{entry.total}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
