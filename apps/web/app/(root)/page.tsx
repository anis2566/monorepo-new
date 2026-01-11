import { DashboardSkeleton } from "@/modules/dashboard/ui/views/dashboard-skeleton";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Dashboard = async () => {
  await Promise.all([
    prefetch(trpc.admin.dashboard.getStats.queryOptions()),
    prefetch(trpc.admin.dashboard.getAttemptStats.queryOptions()),
    prefetch(trpc.admin.dashboard.getTopPerformers.queryOptions({ limit: 5 })),
    prefetch(trpc.admin.dashboard.getExamDistribution.queryOptions()),
    prefetch(trpc.admin.dashboard.getSubjectPerformance.queryOptions()),
    prefetch(
      trpc.admin.dashboard.getPerformanceData.queryOptions({ months: 6 })
    ),
    prefetch(
      trpc.admin.dashboard.getRecentActivities.queryOptions({ limit: 10 })
    ),
    prefetch(trpc.admin.dashboard.getRecentExams.queryOptions({ limit: 5 })),
    prefetch(
      trpc.admin.student.getPendingVerifications.queryOptions({ limit: 3 })
    ),
  ]);

  return (
    <HydrateClient suspenseUi={<DashboardSkeleton />}>
      <DashboardView />
    </HydrateClient>
  );
};

export default Dashboard;
