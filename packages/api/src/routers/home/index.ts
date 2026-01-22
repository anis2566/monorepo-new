import { createTRPCRouter } from "../../trpc";
import { courseRouter } from "./course";
import { subjectRouter } from "./subject";
import { serviceRouter } from "./services";

export const homeRouter = createTRPCRouter({
  course: courseRouter,
  subject: subjectRouter,
  service: serviceRouter,
});
