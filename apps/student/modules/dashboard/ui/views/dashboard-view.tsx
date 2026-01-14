"use client";

import { WelcomeCard } from "../components/welcome-card";
import { Card } from "@workspace/ui/components/card";
import {
  ChevronRight,
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { ExamCard } from "@/components/exam-card";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { ResultCard } from "@/components/result-card";

export const DashboardView = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.student.dashboard.get.queryOptions());

  const {
    upcomingExams = [],
    student,
    totalExam = 0,
    activeExam = 0,
    upcomingExamCount = 0,
    completedExam = 0,
    ongoingExam = [],
    recentResults = [],
  } = data || {};

  return (
    <div className="px-4 lg:px-8 pt-4 pb-6 max-w-7xl mx-auto space-y-6">
      {/* Mobile Welcome Card */}
      <div className="lg:hidden">
        <WelcomeCard student={student || null} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalExam}</p>
            <p className="text-sm text-muted-foreground">Total Exams</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{activeExam}</p>
            <p className="text-sm text-muted-foreground">Active Now</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">
              {upcomingExamCount}
            </p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <XCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">
              {completedExam}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Ongoing Exams */}
        <div className="lg:col-span-2 space-y-4 mb-6 lg:mb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Ongoing Exams
            </h2>
            {ongoingExam.length > 0 && (
              <Link
                href="/exams"
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {ongoingExam.length > 0 ? (
              ongoingExam
                .slice(0, 3)
                .map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    totalQuestions={exam._count.mcqs}
                  />
                ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No Ongoing exams</p>
                <p className="text-sm mt-1">Check back later for new exams</p>
              </Card>
            )}
          </div>

          {/* Upcoming Exams - Takes 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Exams
              </h2>
              {upcomingExams.length > 0 && (
                <Link
                  href="/exams"
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {upcomingExams.length > 0 ? (
                upcomingExams
                  .slice(0, 3)
                  .map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      totalQuestions={exam._count.mcqs}
                    />
                  ))
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">No upcoming exams</p>
                  <p className="text-sm mt-1">Check back later for new exams</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Recent Results - Takes 1 column on desktop */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Recent Results
            </h2>
            {recentResults.length > 0 && (
              <Link
                href="/results"
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.slice(0, 3).map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No results yet</p>
              <p className="text-sm mt-1">Complete an exam to see results</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
