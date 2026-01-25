import { createTRPCRouter } from "../../trpc";
import { courseRouter } from "./course";
import { subjectRouter } from "./subject";
import { serviceRouter } from "./services";
import { demoExamRouter } from "./demo-exam";
import { teacherRouter } from "./teacher";
import { examRouter } from "./exam";

export const homeRouter = createTRPCRouter({
  course: courseRouter,
  subject: subjectRouter,
  exam: examRouter,
  service: serviceRouter,
  demoExam: demoExamRouter,
  teacher: teacherRouter,
});
