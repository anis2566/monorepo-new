import { Trophy, Medal } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { MeritStudent } from "@/types/merit";

interface TopThreePodiumProps {
  students: MeritStudent[];
}

function PodiumCard({
  student,
  position,
}: {
  student: MeritStudent;
  position: 1 | 2 | 3;
}) {
  const config = {
    1: {
      gradient: "gradient-gold",
      shadow: "shadow-gold",
      bg: "bg-gold-light",
      text: "text-gold",
      icon: Trophy,
      height: "h-32",
      delay: "200ms",
      order: "order-2",
      scale: "scale-105",
    },
    2: {
      gradient: "gradient-silver",
      shadow: "shadow-card",
      bg: "bg-silver-light",
      text: "text-silver",
      icon: Medal,
      height: "h-24",
      delay: "100ms",
      order: "order-1",
      scale: "",
    },
    3: {
      gradient: "gradient-bronze",
      shadow: "shadow-card",
      bg: "bg-bronze-light",
      text: "text-bronze",
      icon: Medal,
      height: "h-20",
      delay: "300ms",
      order: "order-3",
      scale: "",
    },
  }[position];

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center opacity-0 animate-slide-up",
        config.order,
        config.scale
      )}
      style={{ animationDelay: config.delay }}
    >
      {/* Avatar & Badge */}
      <div className="relative mb-3">
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold",
            config.gradient,
            "text-white shadow-elevated"
          )}
        >
          {student.name.charAt(0)}
        </div>
        <div
          className={cn(
            "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
            config.gradient,
            "text-white text-sm font-bold shadow-lg"
          )}
        >
          {position}
        </div>
      </div>

      {/* Info */}
      <h3 className="font-semibold text-foreground text-center mb-1 line-clamp-1 max-w-[140px]">
        {student.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-2">Roll: {student.roll}</p>
      <div
        className={cn(
          "px-4 py-2 rounded-full font-bold text-lg",
          config.bg,
          config.text
        )}
      >
        {student.score}/{student.totalMarks}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {student.percentage}%
      </p>

      {/* Podium */}
      <div
        className={cn(
          "mt-4 w-28 rounded-t-lg flex items-center justify-center",
          config.gradient,
          config.height
        )}
      >
        <Icon className="w-8 h-8 text-white/80" />
      </div>
    </div>
  );
}

export function TopThreePodium({ students }: TopThreePodiumProps) {
  const top3 = students.slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
      <h2 className="text-xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Trophy className="w-6 h-6 text-gold" />
        Top Performers
      </h2>

      <div className="flex items-end justify-center gap-4 md:gap-8">
        {top3[1] && <PodiumCard student={top3[1]} position={2} />}
        {top3[0] && <PodiumCard student={top3[0]} position={1} />}
        {top3[2] && <PodiumCard student={top3[2]} position={3} />}
      </div>
    </div>
  );
}
