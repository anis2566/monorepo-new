import { Card, CardContent } from "@workspace/ui/components/card";

interface StatsProps {
  totalAttempts: number;
  completedAttempts: number;
  inProgressAttempts: number;
  averageScore: number | null;
}

export const Stats = ({
  totalAttempts,
  completedAttempts,
  inProgressAttempts,
  averageScore,
}: StatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {totalAttempts}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total Attempts
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-success">
            {completedAttempts}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {inProgressAttempts}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            In Progress
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-accent">
            {averageScore ? Math.round(averageScore) : 0}%
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Avg Score</p>
        </CardContent>
      </Card>
    </div>
  );
};
