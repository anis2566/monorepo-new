import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { BookOpen, TrendingUp, TrendingDown } from "lucide-react";

interface SubjectPerformance {
  id: string;
  name: string;
  avgScore: number;
  totalAttempts: number;
  trend: number;
}

interface SubjectPerformanceChartProps {
  subjects: SubjectPerformance[];
}

export function SubjectPerformanceChart({
  subjects,
}: SubjectPerformanceChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Subject-wise Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {subject.name}
                </span>
                {subject.trend !== 0 && (
                  <div
                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                      subject.trend > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {subject.trend > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(subject.trend)}%
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {subject.totalAttempts} attempts
                </span>
                <span className="text-sm font-bold text-foreground">
                  {subject.avgScore}%
                </span>
              </div>
            </div>
            <Progress value={subject.avgScore} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
