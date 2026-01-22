import { createTRPCRouter } from "../../trpc";
import { classRouter } from "./class";
import { instituteRouter } from "./institute";
import { studentRouter } from "./student";
import { subjectRouter } from "./subject";
import { chapterRouter } from "./chapter";
import { mcqRouter } from "./mcq";
import { batchRouter } from "./batch";
import { examRouter } from "./exam";
import { userRouter } from "./user";
import { resultRouter } from "./result";
import { dashboardRouter } from "./dashboard";
import { courseRouter } from "./course";
import { topicRouter } from "./topic";

export const adminRouter = createTRPCRouter({
  class: classRouter,
  institute: instituteRouter,
  student: studentRouter,
  subject: subjectRouter,
  chapter: chapterRouter,
  mcq: mcqRouter,
  batch: batchRouter,
  exam: examRouter,
  user: userRouter,
  result: resultRouter,
  dashboard: dashboardRouter,
  course: courseRouter,
  topic: topicRouter,
});
