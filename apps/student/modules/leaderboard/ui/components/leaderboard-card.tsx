import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Flame, Zap } from "lucide-react";
import { LeaderboardEntry } from "@/types/leaderboard"; // ✅ FIXED: Correct import

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  showMetric?: "score" | "streak" | "xp";
}

const rankStyles: Record<number, string> = {
  1: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30",
  2: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 shadow-lg shadow-slate-400/30",
  3: "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30",
};

const rankIcons: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function LeaderboardCard({
  entry,
  isCurrentUser,
  showMetric = "score",
}: LeaderboardCardProps) {
  const {
    rank,
    studentName,
    className,
    batch,
    totalScore,
    averagePercentage,
    bestStreak,
    totalXp,
    imageUrl,
  } = entry;

  const isTopThree = rank <= 3;
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const getMetricDisplay = () => {
    switch (showMetric) {
      case "streak":
        return (
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-bold">{bestStreak}</span>
          </div>
        );
      case "xp":
        return (
          <div className="flex items-center gap-1 text-primary">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{totalXp.toLocaleString()}</span>
          </div>
        );
      default:
        return (
          <div className="text-right">
            <div className="font-bold text-foreground">{totalScore}</div>
            <div className="text-xs text-muted-foreground">
              {averagePercentage.toFixed(1)}%
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        isCurrentUser
          ? "bg-primary/10 border-2 border-primary ring-2 ring-primary/20"
          : "bg-card hover:bg-muted/50",
        isTopThree && "py-4"
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
          isTopThree ? rankStyles[rank] : "bg-muted text-muted-foreground"
        )}
      >
        {isTopThree ? rankIcons[rank] : rank}
      </div>

      {/* Avatar */}
      <Avatar
        className={cn("shrink-0", isTopThree ? "w-12 h-12" : "w-10 h-10")}
      >
        <AvatarImage src={imageUrl || undefined} alt={studentName} />
        <AvatarFallback
          className={cn(
            isTopThree && rank === 1 && "bg-yellow-100 text-yellow-800",
            isTopThree && rank === 2 && "bg-slate-100 text-slate-700",
            isTopThree && rank === 3 && "bg-amber-100 text-amber-800"
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn("font-semibold truncate", isTopThree && "text-lg")}
          >
            {studentName}
          </span>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs shrink-0">
              You
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{className}</span>
          {batch && (
            <>
              <span>•</span>
              <span className="truncate">{batch}</span>
            </>
          )}
        </div>
      </div>

      {/* Metric */}
      {getMetricDisplay()}
    </div>
  );
}
