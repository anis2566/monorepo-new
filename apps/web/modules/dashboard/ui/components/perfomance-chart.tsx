"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@workspace/ui/components/chart";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

interface PerformanceData {
  month: string;
  attempts: number;
  avgScore: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const chartConfig = {
  attempts: {
    label: "Attempts",
    color: "hsl(var(--primary))",
  },
  avgScore: {
    label: "Avg Score %",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const recent = data[data.length - 1]?.avgScore || 0;
    const previous = data[data.length - 2]?.avgScore || 0;
    return ((recent - previous) / previous) * 100;
  };

  const trend = calculateTrend();

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription className="mt-1">
              Monthly exam attempts and average scores
            </CardDescription>
          </div>
          {trend !== 0 && (
            <div
              className={`hidden sm:flex items-center gap-2 text-sm ${
                trend > 0 ? "text-success" : "text-destructive"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${trend < 0 ? "rotate-180" : ""}`}
              />
              <span className="font-medium">
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] sm:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
                label={{
                  value: "Attempts",
                  angle: -90,
                  position: "insideLeft",
                  className: "text-xs fill-muted-foreground",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
                label={{
                  value: "Score %",
                  angle: 90,
                  position: "insideRight",
                  className: "text-xs fill-muted-foreground",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `${value}`}
                    formatter={(value, name) => {
                      if (name === "avgScore") {
                        return [`${value}%`, "Avg Score"];
                      }
                      return [value, "Attempts"];
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="left"
                dataKey="attempts"
                fill="url(#colorAttempts)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgScore"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{
                  fill: "hsl(var(--accent))",
                  r: 4,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
