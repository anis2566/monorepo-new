import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Shield, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OTPVerificationStepProps {
  phone: string;
  onNext: () => void;
  onBack: () => void;
  onResend: () => void;
}

export const OTPVerificationStep = ({
  phone,
  onNext,
  onBack,
  onResend,
}: OTPVerificationStepProps) => {
  const [otp, setOtp] = useState("123456");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const trpc = useTRPC();

  const { mutate: verifyVerificationSms, isPending } = useMutation(
    trpc.user.verifyVerificationSms.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        if (data.success) {
          onNext();
        }
      },
    })
  );

  const { mutate: resendVerificationSms, isPending: isResending } = useMutation(
    trpc.user.resendVerificationSms.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        if (data.success) {
          toast.success("Verification code has been sent again.");
        }
      },
    })
  );

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    verifyVerificationSms({
      verificationCode: otp,
    });

    setIsVerifying(false);
  };

  const handleResend = () => {
    setCanResend(false);
    setResendTimer(30);
    setOtp("");
    setError("");
    resendVerificationSms();
  };

  const maskedPhone = phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1****$3");

  return (
    <div className="flex flex-col items-center px-4 animate-slide-up">
      {/* Icon */}
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-primary" />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Verify Your Number
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-semibold text-foreground mt-1">
          +91 {maskedPhone}
        </p>
      </div>

      {/* OTP Input */}
      <div className="mb-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError("");
          }}
          disabled={isVerifying || isPending}
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-11 h-12 text-lg font-semibold rounded-xl border-input bg-background"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p className="text-xs text-destructive text-center mt-2">{error}</p>
        )}
      </div>

      {/* Resend */}
      <div className="mb-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline mx-auto"
            disabled={isVerifying || isPending || isResending}
          >
            <RefreshCw className="w-3 h-3" />
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend code in{" "}
            <span className="font-semibold text-foreground">
              {resendTimer}s
            </span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <Button
          variant="default"
          size="lg"
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying || isPending || isResending}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={onBack}
          className="w-full hover:bg-muted hover:text-black"
          disabled={isVerifying || isPending || isResending}
        >
          Change Number
        </Button>
      </div>
    </div>
  );
};
