import { adminRouter } from "../routers/admin";
import { authRouter } from "../routers/auth";
import { userRouter } from "../routers/auth/user";
import { createTRPCRouter } from "./index";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
