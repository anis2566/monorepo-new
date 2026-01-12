"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceData {
  month: string;
  score: number;
  attempts: number;
}

interface AnswerDistribution {
  name: string;
  value: number;
  color: string;
}

interface StudentPerformanceChartProps {
  data: PerformanceData[];
  answerDistribution: AnswerDistribution[];
  stats: {
    totalTime: number;
    totalCorrect: number;
    totalWrong: number;
    bestStreak: number;
  };
}

export function StudentPerformanceChart({
  data,
  answerDistribution,
  stats,
}: StudentPerformanceChartProps) {
  const [chartColors, setChartColors] = useState({
    correct: "#10b981",
    wrong: "#ef4444",
    skipped: "#94a3b8",
  });

  useEffect(() => {
    // Get computed CSS colors
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setChartColors({
      correct: "#10b981", // green-500
      wrong: "#ef4444", // red-500
      skipped: "#94a3b8", // slate-400
    });
  }, []);

  // Override colors from backend with proper color values
  const pieData = answerDistribution.map((item) => {
    let color = item.color;

    if (item.name === "Correct") {
      color = chartColors.correct;
    } else if (item.name === "Wrong") {
      color = chartColors.wrong;
    } else if (item.name === "Skipped") {
      color = chartColors.skipped;
    }

    return {
      ...item,
      color,
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Score Trend Chart */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Score Trend
            </CardTitle>
            <CardDescription>Monthly average score progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorScore)"
                    strokeWidth={3}
                    dot={{
                      fill: "hsl(var(--primary))",
                      strokeWidth: 2,
                      r: 4,
                      stroke: "hsl(var(--background))",
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: "hsl(var(--background))",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Answer Distribution Pie */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Answer Distribution
            </CardTitle>
            <CardDescription>Overall answer breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">
              {stats.totalTime}
            </p>
            <p className="text-xs text-muted-foreground">Total Minutes Spent</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold text-foreground">
              {stats.totalCorrect}
            </p>
            <p className="text-xs text-muted-foreground">Total Correct</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold text-foreground">
              {stats.totalWrong}
            </p>
            <p className="text-xs text-muted-foreground">Total Wrong</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-foreground">
              {stats.bestStreak}
            </p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
