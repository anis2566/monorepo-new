import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getServerSession = async () => {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const getSession = cache(() => getServerSession());
