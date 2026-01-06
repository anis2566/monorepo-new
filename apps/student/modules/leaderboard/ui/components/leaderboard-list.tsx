import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Trophy, Calendar, Flame } from "lucide-react";
import { TopThreePodium } from "./three-podium";
import { LeaderboardCard } from "./leaderboard-card";
import { LeaderboardEntry } from "@/types/leaderboard"; // ✅ FIXED: Correct import

interface LeaderboardListProps {
  overallData: LeaderboardEntry[];
  weeklyData: LeaderboardEntry[];
  streakData: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardList({
  overallData,
  weeklyData,
  streakData,
  currentUserId,
}: LeaderboardListProps) {
  const renderLeaderboard = (
    data: LeaderboardEntry[],
    showMetric: "score" | "streak" | "xp" = "score",
    showPodium = true
  ) => {
    const topThree = data.slice(0, 3);
    const rest = data.slice(3);

    return (
      <div className="space-y-4">
        {showPodium && topThree.length >= 3 && (
          <TopThreePodium entries={topThree} currentUserId={currentUserId} />
        )}

        <div className="space-y-2">
          {(showPodium ? rest : data).map((entry) => (
            <LeaderboardCard
              key={entry.id}
              entry={entry}
              isCurrentUser={entry.studentId === currentUserId}
              showMetric={showMetric}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue="overall" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="overall" className="gap-1">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Overall</span>
        </TabsTrigger>
        <TabsTrigger value="weekly" className="gap-1">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Weekly</span>
        </TabsTrigger>
        <TabsTrigger value="streak" className="gap-1">
          <Flame className="w-4 h-4" />
          <span className="hidden sm:inline">Streaks</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overall" className="mt-0">
        {renderLeaderboard(overallData, "score")}
      </TabsContent>

      <TabsContent value="weekly" className="mt-0">
        {renderLeaderboard(weeklyData, "score")}
      </TabsContent>

      <TabsContent value="streak" className="mt-0">
        {renderLeaderboard(streakData, "streak")}
      </TabsContent>
    </Tabs>
  );
}
