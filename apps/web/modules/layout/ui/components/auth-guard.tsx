import { redirect } from "next/navigation";

import { ROLE } from "@workspace/utils/constant";
import { getUserRole } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = async ({ children }: AuthGuardProps) => {
  const role = await getUserRole();

  if (role !== ROLE.Admin) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
};
