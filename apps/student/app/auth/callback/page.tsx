"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export default function AuthCallbackPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: user, isLoading } = useQuery(
    trpc.user.getVerifiedUser.queryOptions()
  );

  useEffect(() => {
    if (!isLoading && user) {
      if (user.isVerifiedStudent === false) {
        // New user - needs onboarding
        router.push("/onboarding");
      } else {
        // Existing user - go to dashboard
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  );
}
