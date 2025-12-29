import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@workspace/auth";

console.log("Auth Init:", {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET ? "SET" : "MISSING",
});

export const auth = initAuth({
  baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
  productionUrl: process.env.NEXT_PUBLIC_APP_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);
