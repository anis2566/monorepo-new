import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "@workspace/db";

interface CreateContextOptions {
  headers: Headers;
  auth?: any;
}

interface FetchContextWithAuth extends FetchCreateContextFnOptions {
  auth?: any;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createTRPCContext(
  opts: FetchContextWithAuth | CreateContextOptions
) {
  let session = null;

  // Check if auth is provided (works for both fetch adapter and custom context)
  if (opts.auth) {
    const headers = "req" in opts ? opts.req.headers : opts.headers;
    session = await opts.auth.api.getSession({
      headers,
    });
  }

  return {
    session: session ?? null,
    user: session?.user ?? null,
    db: prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
