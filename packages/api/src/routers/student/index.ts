import { createTRPCRouter } from "../../trpc";
import { dashboardRouter } from "./dashboard";
import { examRouter } from "./exam";
import { resultRouter } from "./result";
import { leaderboardRouter } from "./leaderboard";
import { profileRouter } from "./profile";

export const studentRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  exam: examRouter,
  result: resultRouter,
  leaderboard: leaderboardRouter,
  profile: profileRouter,
});
