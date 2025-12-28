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
    process.env.NODE_ENV === "production"
      ? options.productionUrl
      : options.baseUrl;

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
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      autoSignIn: true,
      requireEmailVerification: false,
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
