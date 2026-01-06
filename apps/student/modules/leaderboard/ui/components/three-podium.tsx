import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { LeaderboardEntry } from "@/types/leaderboard"; // ✅ FIXED: Correct import

interface TopThreePodiumProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function TopThreePodium({
  entries,
  currentUserId,
}: TopThreePodiumProps) {
  const first = entries[0];
  const second = entries[1];
  const third = entries[2];

  if (!first) return null;

  const PodiumSpot = ({
    entry,
    position,
  }: {
    entry?: LeaderboardEntry;
    position: 1 | 2 | 3;
  }) => {
    if (!entry) return <div className="flex-1" />;

    const isCurrentUser = entry.studentId === currentUserId;
    const initials = entry.studentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

    const heights = { 1: "h-24", 2: "h-16", 3: "h-12" };
    const avatarSizes = { 1: "w-16 h-16", 2: "w-12 h-12", 3: "w-12 h-12" };
    const bgColors = {
      1: "bg-gradient-to-t from-yellow-400 to-yellow-300",
      2: "bg-gradient-to-t from-slate-300 to-slate-200",
      3: "bg-gradient-to-t from-amber-600 to-amber-500",
    };
    const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };

    return (
      <div className="flex flex-col items-center gap-2 flex-1">
        {/* Avatar and info */}
        <div className="relative">
          <Avatar
            className={cn(
              avatarSizes[position],
              "ring-2 ring-offset-2",
              position === 1 && "ring-yellow-400",
              position === 2 && "ring-slate-300",
              position === 3 && "ring-amber-600",
              isCurrentUser && "ring-primary"
            )}
          >
            <AvatarImage
              src={entry.imageUrl || undefined}
              alt={entry.studentName}
            />
            <AvatarFallback
              className={cn(
                position === 1 && "bg-yellow-100 text-yellow-800",
                position === 2 && "bg-slate-100 text-slate-700",
                position === 3 && "bg-amber-100 text-amber-800"
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 text-lg">
            {medals[position]}
          </span>
        </div>

        <div className="text-center">
          <p
            className={cn(
              "font-semibold truncate max-w-[80px]",
              position === 1 ? "text-sm" : "text-xs"
            )}
          >
            {entry.studentName.split(" ")[0]}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.totalScore} pts
          </p>
        </div>

        {/* Podium */}
        <div
          className={cn(
            "w-full rounded-t-lg flex items-end justify-center pb-2",
            heights[position],
            bgColors[position]
          )}
        >
          <span className="text-2xl font-bold text-white/80">{position}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-2 px-4 pt-4 pb-0">
      <PodiumSpot entry={second} position={2} />
      <PodiumSpot entry={first} position={1} />
      <PodiumSpot entry={third} position={3} />
    </div>
  );
}
