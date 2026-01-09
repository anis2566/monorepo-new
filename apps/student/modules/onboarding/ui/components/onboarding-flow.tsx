"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StepIndicator } from "../components/step-indicator";
import { CongratulationsStep } from "../components/congratulation-step";
import { ClassPhoneIdStep } from "../components/class-phone-id-step";
import { OTPVerificationStep } from "../components/otp-verification-step";
import { AccountPhoneStep } from "../components/account-phone-step";
import { SuccessStep } from "../components/success-step";
import { Card } from "@workspace/ui/components/card";

interface OnboardingData {
  classLevel: string;
  verificationPhone: string;
  accountPhone: string;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const OnboardingFlow = ({
  onComplete,
  onCancel,
}: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    classLevel: "",
    verificationPhone: "",
    accountPhone: "",
  });

  const totalSteps = 5;

  const handleCongratulationsNext = () => {
    setCurrentStep(2);
  };

  const handleClassPhoneNext = (stepData: {
    classLevel: string;
    phone: string;
  }) => {
    setData((prev) => ({
      ...prev,
      classLevel: stepData.classLevel,
      verificationPhone: stepData.phone,
    }));
    toast.success("Verification code sent!", {
      description: `Code sent to +88 ${stepData.phone}`,
    });
    setCurrentStep(3);
  };

  const handleOTPNext = () => {
    toast.success("Phone verified successfully!");
    setCurrentStep(4);
  };

  const handleAccountPhoneNext = (stepData: {
    accountPhone: string;
    useSameNumber: boolean;
  }) => {
    setData((prev) => ({
      ...prev,
      accountPhone: stepData.accountPhone,
    }));
    setCurrentStep(5);
  };

  const handleResendOTP = () => {
    toast.info("Verification code resent!", {
      description: `New code sent to +88 ${data.verificationPhone}`,
    });
  };

  const handleComplete = () => {
    toast.success("Welcome aboard! 🎉");

    // Call parent completion handler if provided
    if (onComplete) {
      onComplete();
    } else {
      // Reset state if no handler provided
      setTimeout(() => {
        setCurrentStep(1);
        setData({
          classLevel: "",
          verificationPhone: "",
          accountPhone: "",
        });
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CongratulationsStep onNext={handleCongratulationsNext} />;
      case 2:
        return (
          <ClassPhoneIdStep onNext={handleClassPhoneNext} onBack={handleBack} />
        );
      case 3:
        return (
          <OTPVerificationStep
            phone={data.verificationPhone}
            onNext={handleOTPNext}
            onBack={handleBack}
            onResend={handleResendOTP}
          />
        );
      case 4:
        return (
          <AccountPhoneStep
            verifiedPhone={data.verificationPhone}
            onNext={handleAccountPhoneNext}
            onBack={handleBack}
          />
        );
      case 5:
        return <SuccessStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-[400px] w-full mx-auto rounded-2xl border shadow-lg overflow-hidden">
      {/* Step Indicator - Hidden on first and last step */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="pt-6 pb-4 bg-background sticky top-0 z-10">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      )}

      {/* Content */}
      <div
        className={`pb-8 ${currentStep === 1 || currentStep === 5 ? "pt-8" : "pt-2"}`}
      >
        {renderStep()}
      </div>
    </Card>
  );
};
