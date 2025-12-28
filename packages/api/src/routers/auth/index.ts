import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../../trpc";

export const authRouter = {
  getMany: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),
} satisfies TRPCRouterRecord;
