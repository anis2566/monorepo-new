import { createTRPCRouter } from "../../trpc";
import { classRouter } from "./class";
import { instituteRouter } from "./institute";
import { studentRouter } from "./student";
import { subjectRouter } from "./subject";
import { chapterRouter } from "./chapter";
import { mcqRouter } from "./mcq";

export const adminRouter = createTRPCRouter({
  class: classRouter,
  institute: instituteRouter,
  student: studentRouter,
  subject: subjectRouter,
  chapter: chapterRouter,
  mcq: mcqRouter,
});
