import { BookOpen, CheckCircle2, Trophy, TrendingUp } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

interface QuickStatsProps {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  streak: number;
}

export function QuickStats({
  totalExams,
  completedExams,
  averageScore,
  streak,
}: QuickStatsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: "Available",
      value: totalExams,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedExams,
      color: "bg-success/10 text-success",
    },
    {
      icon: Trophy,
      label: "Avg Score",
      value: `${averageScore}%`,
      color: "bg-warning/10 text-warning",
    },
    {
      icon: TrendingUp,
      label: "Streak",
      value: `${streak} days`,
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
          >
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
