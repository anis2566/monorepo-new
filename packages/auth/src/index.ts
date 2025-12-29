import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@workspace/db";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}) {
  const baseURL =
    options.baseUrl ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (
    !baseURL ||
    (!baseURL.startsWith("http://") && !baseURL.startsWith("https://"))
  ) {
    console.warn(
      "Better Auth: [baseURL] is missing or invalid. It must be an absolute URL (e.g., http://localhost:3000). Current value:",
      baseURL
    );
  }

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    baseURL,
    secret: options.secret,
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 30 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      autoSignIn: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [nextCookies()],
  });
}

// For CLI usage and backward compatibility
export function auth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string;
}) {
  return initAuth(options);
}
