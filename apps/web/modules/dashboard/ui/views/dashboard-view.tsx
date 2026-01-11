"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import {
  ActivityIcon,
  AlertCircle,
  ClipboardList,
  FileText,
  GraduationCap,
  UserCheck,
  UsersRound,
  TrendingUp,
} from "lucide-react";

import { StatsCard } from "../components/stats-card";
import { PerformanceChart } from "../components/perfomance-chart";
import { QuickActions } from "../components/quick-actions";
import { RecentActivityList } from "../components/recent-activity-list";
import { RecentExams } from "../components/recent-exams";
import { ExamAttemptAnalytics } from "../components/exam-attempt-analytics";
import { TopPerformers } from "../components/top-performers";
// import { ExamStatusDistribution } from "../components/exam-status-distribution";
import { StudentVerificationQueue } from "../components/student-verification-queue";
import { SubjectPerformanceChart } from "../components/subject-performance-chart";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export const DashboardView = () => {
  const trpc = useTRPC();

  // Use suspense queries
  const { data: stats } = useSuspenseQuery(
    trpc.admin.dashboard.getStats.queryOptions()
  );

  const { data: attemptStats } = useSuspenseQuery(
    trpc.admin.dashboard.getAttemptStats.queryOptions()
  );

  const { data: topPerformers } = useSuspenseQuery(
    trpc.admin.dashboard.getTopPerformers.queryOptions({ limit: 5 })
  );

  //   const { data: examDistribution } = useSuspenseQuery(
  //     trpc.admin.dashboard.getExamDistribution.queryOptions()
  //   );

  const { data: subjectPerformance } = useSuspenseQuery(
    trpc.admin.dashboard.getSubjectPerformance.queryOptions()
  );

  const { data: performanceData } = useSuspenseQuery(
    trpc.admin.dashboard.getPerformanceData.queryOptions({ months: 6 })
  );

  const { data: recentActivities } = useSuspenseQuery(
    trpc.admin.dashboard.getRecentActivities.queryOptions({ limit: 10 })
  );

  const { data: recentExams } = useSuspenseQuery(
    trpc.admin.dashboard.getRecentExams.queryOptions({ limit: 5 })
  );

  const { data: pendingStudents } = useSuspenseQuery(
    trpc.admin.student.getPendingVerifications.queryOptions({ limit: 3 })
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your exams
            today.
          </p>
        </div>
      </div>

      <div className="md:hidden">
        <QuickActions />
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle={`+${stats.newStudentsThisMonth} this month`}
          icon={GraduationCap}
          variant="primary"
          trend={{
            value: stats.studentTrend,
            isPositive: stats.studentTrend > 0,
          }}
        />
        <StatsCard
          title="Active Exams"
          value={stats.activeExams}
          subtitle={`${stats.ongoingExams} ongoing now`}
          icon={ClipboardList}
          variant="accent"
          trend={{
            value: stats.examTrend,
            isPositive: stats.examTrend > 0,
          }}
        />
        <StatsCard
          title="MCQ Bank"
          value={stats.mcqBank}
          subtitle="Questions available"
          icon={FileText}
          variant="success"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Active this week"
          icon={UsersRound}
          variant="warning"
          trend={{
            value: stats.userTrend,
            isPositive: stats.userTrend > 0,
          }}
        />
      </div>

      {/* Secondary Stats - Improved Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-card hover:shadow-lg transition-all border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Attempts
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {stats.totalAttempts}
                </p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <ActivityIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all border-l-4 border-l-warning">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Verifications
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {stats.pendingVerifications}
                </p>
              </div>
              <div className="bg-warning/10 rounded-xl p-3">
                <UserCheck className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all border-l-4 border-l-success col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Alerts
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {stats.activeAlerts}
                </p>
              </div>
              <div className="bg-success/10 rounded-xl p-3">
                <AlertCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Charts and Tables */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          <PerformanceChart data={performanceData} />
          <RecentExams exams={recentExams} />
          <SubjectPerformanceChart subjects={subjectPerformance} />
          <TopPerformers performers={topPerformers} />
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="space-y-6 sm:space-y-8">
          <div className="hidden md:block">
            <QuickActions />
          </div>
          <ExamAttemptAnalytics data={attemptStats} />
          <StudentVerificationQueue
            students={pendingStudents}
            onApprove={() => {}}
            onReject={() => {}}
          />
          {/* <ExamStatusDistribution data={examDistribution} /> */}
          <RecentActivityList activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};
