"use client";

import { OnboardingFlow } from "../components/onboarding-flow";
import { useRouter } from "next/navigation";

export const OnboardingView = () => {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to dashboard after completion
    router.push("/");
    // Or refresh to update user state
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <OnboardingFlow onComplete={handleComplete} />
    </div>
  );
};
