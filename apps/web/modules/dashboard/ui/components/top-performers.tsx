import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";

interface TopPerformer {
  id: string;
  name: string;
  imageUrl: string | null | undefined;
  avgScore: number;
  totalAttempts: number;
  bestStreak: number;
  rank: number;
}

interface TopPerformersProps {
  performers: TopPerformer[];
}

export function TopPerformers({ performers }: TopPerformersProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  if (!performers || performers.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {performers.slice(0, 5).map((performer) => (
          <div
            key={performer.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8">
              {getRankIcon(performer.rank) || (
                <span className="text-sm font-bold text-muted-foreground">
                  {performer.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={performer.imageUrl || undefined}
                alt={performer.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {performer.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {performer.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs bg-success/10 text-success border-success/20"
                >
                  {performer.avgScore}% avg
                </Badge>
                {performer.bestStreak > 5 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-warning/10 text-warning border-warning/20"
                  >
                    🔥 {performer.bestStreak} streak
                  </Badge>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="h-3 w-3" />
                <span className="text-lg font-bold">{performer.avgScore}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {performer.totalAttempts} attempts
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
