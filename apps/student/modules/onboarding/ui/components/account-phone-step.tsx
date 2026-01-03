"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Smartphone, Info } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface AccountPhoneStepProps {
  verifiedPhone: string;
  onNext: (data: { accountPhone: string; useSameNumber: boolean }) => void;
  onBack: () => void;
}

export const AccountPhoneStep = ({
  verifiedPhone,
  onNext,
  onBack,
}: AccountPhoneStepProps) => {
  const [useSameNumber, setUseSameNumber] = useState(true);
  const [accountPhone, setAccountPhone] = useState("");
  const [error, setError] = useState("");

  const trpc = useTRPC();

  const { mutate: assignAccountPhone, isPending } = useMutation(
    trpc.user.assignAccountPhone.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        if (data.success) {
          onNext({ accountPhone, useSameNumber: false });
        }
      },
    })
  );

  const validatePhone = (value: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const handleSubmit = () => {
    if (useSameNumber) {
      onNext({ accountPhone: verifiedPhone, useSameNumber: true });
      return;
    }

    if (!accountPhone) {
      setError("Phone number is required");
      return;
    }

    if (!validatePhone(accountPhone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    assignAccountPhone({
      accountPhone,
    });
  };

  return (
    <div className="flex flex-col px-4 animate-slide-up">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-success" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Account Phone Number
        </h2>
        <p className="text-sm text-muted-foreground">
          This number will be linked to your account
        </p>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl mb-6">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          This phone number will be used for account recovery and important
          notifications.
        </p>
      </div>

      <div className="space-y-5">
        {/* Same Number Checkbox */}
        <div className="flex items-center space-x-3 p-4 bg-secondary/50 rounded-xl">
          <Checkbox
            id="same-number"
            checked={useSameNumber}
            onCheckedChange={(checked) => {
              setUseSameNumber(checked as boolean);
              setError("");
            }}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            disabled={isPending}
          />
          <label
            htmlFor="same-number"
            className="text-sm font-medium text-foreground cursor-pointer flex-1"
          >
            Use verified number
            <span className="block text-xs text-muted-foreground font-normal mt-0.5">
              +88 {verifiedPhone}
            </span>
          </label>
        </div>

        {/* Alternative Phone Input */}
        {!useSameNumber && (
          <div className="space-y-2 animate-slide-up">
            <Label
              htmlFor="account-phone"
              className="text-foreground font-medium"
            >
              Enter Different Number
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                +88
              </span>
              <Input
                id="account-phone"
                type="tel"
                placeholder="Enter phone number"
                value={accountPhone}
                onChange={(e) => {
                  setAccountPhone(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  );
                  setError("");
                }}
                className={`pl-12 ${error ? "border-destructive" : ""}`}
                disabled={isPending}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <Button
          variant="success"
          size="lg"
          onClick={handleSubmit}
          className="w-full"
          disabled={isPending}
        >
          Complete Setup
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={onBack}
          className="w-full hover:bg-muted hover:text-black"
          disabled={isPending}
        >
          Back
        </Button>
      </div>
    </div>
  );
};
