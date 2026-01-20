import { createTRPCRouter } from "../../trpc";
import { programRouter } from "./program";

export const homeRouter = createTRPCRouter({
  program: programRouter,
});
