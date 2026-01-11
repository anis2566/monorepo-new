import { Card, CardContent } from "@workspace/ui/components/card";

interface StatsProps {
  totalExams: number;
  activeExams: number;
  upcomingExams: number;
  completedExams: number;
}

export const Stats = ({
  totalExams,
  activeExams,
  upcomingExams,
  completedExams,
}: StatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {totalExams}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total Exams
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-success">
            {activeExams}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Active Now</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-warning">
            {upcomingExams}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
            {completedExams}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
        </CardContent>
      </Card>
    </div>
  );
};
