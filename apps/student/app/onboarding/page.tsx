import { Metadata } from "next";
import { OnboardingView } from "@/modules/onboarding/ui/views/onboarding-view";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Complete your student profile to get started",
};

const OnboardingPage = () => {
  return <OnboardingView />;
};

export default OnboardingPage;
