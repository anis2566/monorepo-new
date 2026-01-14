import { adminRouter } from "../routers/admin";
import { authRouter } from "../routers/auth";
import { userRouter } from "../routers/auth/user";
import { createTRPCRouter } from "./index";
import { studentRouter } from "../routers/student";
import { publicRouter } from "../routers/public";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
  student: studentRouter,
  public: publicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
