import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Calendar } from "lucide-react";

interface ExamStatusDistributionProps {
  data: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
}

export function ExamStatusDistribution({ data }: ExamStatusDistributionProps) {
  const chartData = [
    { name: "Upcoming", value: data.upcoming, color: "hsl(var(--warning))" },
    { name: "Ongoing", value: data.ongoing, color: "hsl(var(--success))" },
    { name: "Completed", value: data.completed, color: "hsl(var(--muted))" },
  ];

  const total = data.upcoming + data.ongoing + data.completed;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Exam Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{data.upcoming}</p>
            <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{data.ongoing}</p>
            <p className="text-xs text-muted-foreground mt-1">Ongoing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {data.completed}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
