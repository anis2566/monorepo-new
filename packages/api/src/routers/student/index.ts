import { createTRPCRouter } from "../../trpc";
import { dashboardRouter } from "./dashboard";
import { examRouter } from "./exam";

export const studentRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  exam: examRouter,
});
