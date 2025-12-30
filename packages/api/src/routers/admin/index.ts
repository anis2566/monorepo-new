import { createTRPCRouter } from "../../trpc";
import { classRouter } from "./class";
import { instituteRouter } from "./institute";
import { studentRouter } from "./student";

export const adminRouter = createTRPCRouter({
  class: classRouter,
  institute: instituteRouter,
  student: studentRouter,
});
