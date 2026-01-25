import { Card } from "@workspace/ui/components/card";

interface PerformanceStatsProps {
  score: number;
  streak: number;
  bestStreak: number;
  wrong: number;
  answered: number;
  total: number;
}

export function PerformanceStats({
  score,
  streak,
  bestStreak,
  wrong,
  answered,
  total,
}: PerformanceStatsProps) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-foreground mb-1">Performance Stats</h3>
      <p className="text-sm text-muted-foreground mb-4">Track your progress</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-primary">{score}</p>
          <p className="text-xs text-muted-foreground mt-1">Score</p>
        </div>
        <div className="bg-success/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-success">{streak}</p>
          <p className="text-xs text-muted-foreground mt-1">Streak</p>
        </div>
        <div className="bg-warning/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-warning">{bestStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">Best Streak</p>
        </div>
        <div className="bg-destructive/10 rounded-xl p-4">
          <p className="text-2xl font-bold text-destructive">{wrong}</p>
          <p className="text-xs text-muted-foreground mt-1">Wrong</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress:</span>
          <span className="font-medium text-foreground">
            {answered}/{total}
          </span>
        </div>
      </div>
    </Card>
  );
}
