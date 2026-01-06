"use client";

import { UserRankCard } from "../components/user-rank-card";
import { LeaderboardList } from "../components/leaderboard-list";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

export const LeaderboardView = () => {
  const trpc = useTRPC();

  // Fetch all leaderboard data in parallel
  const { data: userRank, isLoading: userRankLoading } = useSuspenseQuery(
    trpc.student.leaderboard.getUserRank.queryOptions()
  );

  const { data: overallData, isLoading: overallLoading } = useSuspenseQuery(
    trpc.student.leaderboard.getOverall.queryOptions({ limit: 50 })
  );

  const { data: weeklyData, isLoading: weeklyLoading } = useSuspenseQuery(
    trpc.student.leaderboard.getWeekly.queryOptions({ limit: 50 })
  );

  const { data: streakData, isLoading: streakLoading } = useSuspenseQuery(
    trpc.student.leaderboard.getStreak.queryOptions({ limit: 50 })
  );

  const isLoading =
    userRankLoading || overallLoading || weeklyLoading || streakLoading;

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!overallData || overallData.length === 0) {
    return (
      <>
        <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <p className="text-5xl mb-4">🏆</p>
            <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
            <p className="text-muted-foreground">
              Complete some exams to see the leaderboard
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto space-y-6">
      {/* Current user rank */}
      {userRank && (
        <UserRankCard entry={userRank} previousRank={userRank.previousRank} />
      )}

      {/* Leaderboard tabs */}
      <LeaderboardList
        overallData={overallData}
        weeklyData={weeklyData}
        streakData={streakData}
        currentUserId={userRank?.studentId}
      />
    </div>
  );
};
