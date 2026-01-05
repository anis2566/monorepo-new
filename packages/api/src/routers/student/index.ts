import { createTRPCRouter } from "../../trpc";
import { dashboardRouter } from "./dashboard";
import { examRouter } from "./exam";
import { resultRouter } from "./result";

export const studentRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  exam: examRouter,
  result: resultRouter,
});
