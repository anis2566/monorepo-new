"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Loader2,
  UserCheck,
  Sparkles,
  Clock,
  FileText,
  Trophy,
  ShieldCheck,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { useTRPC } from "@/trpc/react";
import { EXAM_STATUS } from "@workspace/utils/constant";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

const registrationSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  class: z.string().min(1, "শ্রেণী প্রয়োজন"),
  phone: z.string().regex(/^01[0-9]{9}$/, "সঠিক ফোন নম্বর লিখুন (01XXXXXXXXX)"),
  college: z.string().min(2, "কলেজের নাম প্রয়োজন"),
  email: z.string().email("সঠিক ইমেইল লিখুন").optional().or(z.literal("")),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

type ModalStep = "details" | "registration" | "otp";

export const PublicExamModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>("details");
  const [registrationData, setRegistrationData] =
    useState<RegistrationFormData | null>(null);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: publicExam } = useQuery(
    trpc.home.exam.getPublicExam.queryOptions(),
  );

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      class: "",
      phone: "",
      college: "",
      email: "",
    },
  });

  // OTP timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendOtpMutation = useMutation(
    trpc.public.exam.sendPublicOtp.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("sendPublicOtp not available");
      },
    },
  );

  const verifyOtpMutation = useMutation(
    trpc.public.exam.verifyPublicPhone.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("verifyPublicPhone not available");
      },
    },
  );

  const registerMutation = useMutation(
    trpc.public.exam.registerParticipant.mutationOptions({
      onSuccess: (data) => {
        toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
        setIsOpen(false);
        form.reset();
        setCurrentStep("details");
        setRegistrationData(null);
        setOtp("");
        if (publicExam) {
          router.push(
            `/exams/${publicExam.id}/take/${data.attemptId}?participantId=${data.participantId}`,
          );
        }
      },
      onError: (error) => {
        toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        setIsSubmitting(false);
      },
    }),
  );

  const handleSendOtp = useCallback(
    async (phone: string) => {
      console.log("=== handleSendOtp called ===");
      console.log("Phone:", phone);

      try {
        console.log("Calling sendOtpMutation...");
        const result = await sendOtpMutation.mutateAsync({ phone });
        console.log("OTP sent successfully:", result);

        setTimeLeft(60);
        toast.success("Verification code sent to your phone");
      } catch (error: unknown) {
        console.error("Error sending OTP:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to send OTP",
        );
        throw error; // Re-throw to be caught by onSubmit
      }
    },
    [sendOtpMutation],
  );

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6 || !registrationData) return;
    setIsVerifying(true);
    try {
      console.log("=== Starting OTP verification ===");
      console.log("Phone:", registrationData.phone);
      console.log("OTP:", otp);

      await verifyOtpMutation.mutateAsync({
        phone: registrationData.phone,
        code: otp,
      });
      console.log("✅ OTP verification successful!");
      toast.success("Phone verified successfully!");

      // Now register the participant with verified status
      if (!publicExam) return;

      console.log("=== Starting participant registration ===");
      setIsSubmitting(true);

      await registerMutation.mutateAsync({
        examId: publicExam.id,
        name: registrationData.name,
        class: registrationData.class,
        phone: registrationData.phone,
        college: registrationData.college,
        email: registrationData.email || "",
        isVerified: true,
        // Don't pass otpCode - we already verified it above
      });

      console.log("✅ Registration successful!");
    } catch (error: unknown) {
      console.error("❌ Error in handleVerifyOtp:", error);

      // Show the actual error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification or registration failed";

      toast.error(errorMessage);
      setIsSubmitting(false);
    } finally {
      setIsVerifying(false);
    }
  }, [otp, registrationData, verifyOtpMutation, registerMutation, publicExam]);

  const isExamActive = () => {
    if (!publicExam) return false;
    const now = new Date();
    return (
      now >= new Date(publicExam.startDate) &&
      now <= new Date(publicExam.endDate) &&
      publicExam.status === EXAM_STATUS.Ongoing
    );
  };

  useEffect(() => {
    if (isExamActive()) {
      const timer = setTimeout(() => setIsOpen(true), 5000); // 5 seconds delay
      return () => clearTimeout(timer);
    }
  }, [publicExam]);

  const onSubmit = async (data: RegistrationFormData) => {
    if (!publicExam) return;

    try {
      setRegistrationData(data);

      // Send OTP first before moving to OTP step
      console.log("Sending OTP to:", data.phone);
      await handleSendOtp(data.phone);

      // Only move to OTP step if OTP was sent successfully
      setCurrentStep("otp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("registration");
      setOtp("");
    } else if (currentStep === "registration") {
      setCurrentStep("details");
    }
  };

  if (!publicExam || !isExamActive()) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Reset state when closing
          setCurrentStep("details");
          setRegistrationData(null);
          setOtp("");
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        {currentStep === "details" && (
          <div className="space-y-6">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-bounce">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black text-center text-primary">
                Daily Live Exam!
              </DialogTitle>
              <DialogDescription className="text-center text-base font-medium">
                Join the exam and get a chance to be in our merit list
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 space-y-4">
              <h3 className="font-bold text-xl text-center text-foreground">
                {publicExam.title}
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center space-y-1">
                  <div className="bg-background rounded-xl p-2 shadow-sm">
                    <FileText className="h-5 w-5 mx-auto text-primary" />
                    <p className="font-bold text-sm mt-1">{publicExam.mcq}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    MCQ
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <div className="bg-background rounded-xl p-2 shadow-sm">
                    <Clock className="h-5 w-5 mx-auto text-primary" />
                    <p className="font-bold text-sm mt-1">
                      {publicExam.duration}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Minutes
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <div className="bg-background rounded-xl p-2 shadow-sm">
                    <Trophy className="h-5 w-5 mx-auto text-primary" />
                    <p className="font-bold text-sm mt-1">{publicExam.total}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Marks
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {publicExam.subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="outline"
                    className="bg-background/50"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02]"
                onClick={() => setCurrentStep("registration")}
              >
                Join Exam
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Join Later
              </Button>
            </div>
          </div>
        )}

        {currentStep === "registration" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <UserCheck className="h-6 w-6 text-primary" />
                Fill Your Information
              </DialogTitle>
              <DialogDescription>
                Fill the form below to participate in the exam
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          {...field}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Class *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 12th"
                            {...field}
                            disabled={isSubmitting}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="01XXXXXXXXX"
                            {...field}
                            disabled={isSubmitting}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Educational Institution *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your college/school name"
                          {...field}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 font-bold"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {currentStep === "otp" && registrationData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold text-center">
                Verification Required
              </DialogTitle>
              <DialogDescription className="text-center">
                Please verify your phone number to start the exam
              </DialogDescription>
              <div className="flex items-center justify-center gap-2 text-sm font-medium bg-muted px-3 py-1.5 rounded-full mt-2 mx-auto w-fit">
                <Phone className="w-4 h-4 text-primary" />
                <span>
                  +88{" "}
                  {registrationData.phone.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    "$1 **** $3",
                  )}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(v) => setOtp(v)}
                  disabled={isVerifying || isSubmitting}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <InputOTPSlot
                        key={idx}
                        index={idx}
                        className="w-12 h-14 text-xl font-bold bg-muted/50 border-muted-foreground/20 rounded-xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifying || isSubmitting}
                  className="w-full h-12 text-lg font-semibold"
                >
                  {isVerifying || isSubmitting
                    ? "Verifying..."
                    : "Verify & Start Exam"}
                </Button>

                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in{" "}
                      <span className="font-bold text-foreground">
                        {timeLeft}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={() => handleSendOtp(registrationData.phone)}
                      disabled={sendOtpMutation.isPending}
                      className="text-sm text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw
                        className={cn(
                          "w-3 h-3",
                          sendOtpMutation.isPending && "animate-spin",
                        )}
                      />
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 font-bold"
                  onClick={handleBack}
                  disabled={isVerifying || isSubmitting}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
