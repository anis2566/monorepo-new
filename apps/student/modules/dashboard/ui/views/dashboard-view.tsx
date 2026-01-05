"use client";

import { mockExams, mockResults, mockStudent } from "@/data/mock";
import { WelcomeCard } from "../components/welcome-card";
import { Card } from "@workspace/ui/components/card";
import { ChevronRight, TrendingUp } from "lucide-react";
import { QuickStats } from "../components/quick-stats";
import Link from "next/link";
import { ExamCard } from "@/components/exam-card";
import { ResultCard } from "@/components/result-card";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const DashboardView = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.student.dashboard.get.queryOptions());

  const {
    exams = [],
    student,
    availableExam = 0,
    completedExam = 0,
  } = data || {};

  const upcomingExams = mockExams
    .filter((exam) => exam.status === "Active" || exam.status === "Pending")
    .slice(0, 3);

  const recentResults = mockResults.slice(0, 2);

  const averageScore = Math.round(
    mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length
  );

  return (
    <div className="px-4 lg:px-8 pt-6 pb-4 max-w-7xl mx-auto">
      {/* Desktop Header */}
      <div className="hidden lg:block mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your exam overview.
        </p>
      </div>

      {/* Mobile Welcome Card */}
      <div className="lg:hidden">
        <WelcomeCard student={student || null} />
      </div>

      {/* Desktop Welcome + Stats Row */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-6 gradient-hero">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {student?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground">Welcome back 👋</p>
              <h2 className="text-2xl font-bold text-foreground">
                {student?.name}
              </h2>
              <p className="text-muted-foreground">
                {student?.className.name} • {student?.batch?.name} • Roll:{" "}
                {student?.roll}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-success" />
          </div>
          <p className="text-4xl font-bold text-success">{averageScore}%</p>
          <p className="text-muted-foreground">Average Score</p>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="lg:hidden">
        <QuickStats
          totalExams={availableExam}
          completedExams={completedExam}
          averageScore={averageScore}
          streak={5}
        />
      </div>

      {/* Desktop Stats */}
      <div className="hidden lg:block mb-8">
        <QuickStats
          totalExams={availableExam}
          completedExams={completedExam}
          averageScore={averageScore}
          streak={5}
        />
      </div>

      {/* Content Grid */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Upcoming Exams - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">
              Upcoming Exams
            </h2>
            <Link
              href="/exams"
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {exams.length > 0 ? (
              exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  totalQuestions={exam._count.mcqs}
                />
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                <p className="text-4xl mb-3">📚</p>
                <p>No upcoming exams</p>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Results - Takes 1 column on desktop */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">
              Recent Results
            </h2>
            <Link
              href="/results"
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentResults.length > 0 ? (
            <div className="space-y-4">
              {recentResults.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}

              <Card className="p-4 bg-success/10 border-success/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎉</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Great Progress!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your average is {averageScore}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <p className="text-4xl mb-3">📊</p>
              <p>No results yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
