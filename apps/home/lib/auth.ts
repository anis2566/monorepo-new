"use server";

import { getSession } from "@/auth/server";
import { prisma } from "@workspace/db";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUserRole = cache(async () => {
  const session = await getSession();

  if (!session || !session.user) {
    return redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return user.role;
});
