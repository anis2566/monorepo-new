import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Card } from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { LeaderboardEntry } from "@/types/leaderboard"; // ✅ FIXED: Correct import

interface UserRankCardProps {
  entry: LeaderboardEntry;
  previousRank?: number;
}

export function UserRankCard({ entry, previousRank }: UserRankCardProps) {
  const {
    rank,
    studentName,
    totalScore,
    averagePercentage,
    bestStreak,
    imageUrl,
  } = entry;

  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const rankChange = previousRank ? previousRank - rank : 0;

  const getRankChangeIcon = () => {
    if (rankChange > 0)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (rankChange < 0)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">#{rank}</div>
          <div className="flex items-center justify-center gap-1 text-xs">
            {getRankChangeIcon()}
            <span
              className={cn(
                rankChange > 0 && "text-green-500",
                rankChange < 0 && "text-red-500",
                rankChange === 0 && "text-muted-foreground"
              )}
            >
              {rankChange > 0 && "+"}
              {rankChange !== 0 ? rankChange : "No change"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border" />

        {/* Avatar & Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
            <AvatarImage src={imageUrl || undefined} alt={studentName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{studentName}</p>
            <p className="text-sm text-muted-foreground">Your Ranking</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{totalScore}</div>
          <div className="text-xs text-muted-foreground">Total Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {averagePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500">
            {bestStreak}🔥
          </div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
      </div>
    </Card>
  );
}
