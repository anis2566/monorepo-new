import { createTRPCRouter } from "../../trpc";
import { courseRouter } from "./course";

export const homeRouter = createTRPCRouter({
  course: courseRouter,
});
