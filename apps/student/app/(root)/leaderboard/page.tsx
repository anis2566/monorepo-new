import { Metadata } from "next";
import { LeaderboardView } from "@/modules/leaderboard/ui/views/leaderboard-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Leaderboard - See how you rank against your peers",
};

const Leaderboard = () => {
  // Prefetch all leaderboard data for better performance
  prefetch(trpc.student.leaderboard.getUserRank.queryOptions());
  prefetch(trpc.student.leaderboard.getOverall.queryOptions({ limit: 50 }));
  prefetch(trpc.student.leaderboard.getWeekly.queryOptions({ limit: 50 }));
  prefetch(trpc.student.leaderboard.getStreak.queryOptions({ limit: 50 }));

  return (
    <HydrateClient>
      <LeaderboardView />
    </HydrateClient>
  );
};

export default Leaderboard;
