import { createTRPCRouter } from "../../trpc";
import { classRouter } from "./class";

export const adminRouter = createTRPCRouter({
  class: classRouter,
});
