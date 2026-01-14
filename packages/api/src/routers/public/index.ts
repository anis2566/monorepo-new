import { createTRPCRouter } from "../../trpc";
import { publicExamRouter } from "./exam";

export const publicRouter = createTRPCRouter({
  exam: publicExamRouter,
});
