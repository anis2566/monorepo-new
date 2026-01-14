"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import {
  GraduationCap,
  Phone,
  User,
  Building2,
  Clock,
  HelpCircle,
  Trophy,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  class: z.string().min(1, "Class is required"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid phone number format (e.g., 01712345678)"),
  college: z.string().min(2, "College name is required"),
  email: z.string().email().optional().or(z.literal("")),
  otpCode: z.string().optional(),
});

interface PublicExamPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicExamPage({ params }: PublicExamPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const trpc = useTRPC();

  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [tempFormData, setTempFormData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [otpValue, setOtpValue] = useState("");

  const { data: classes } = useQuery(
    trpc.admin.class.forSelect.queryOptions({ search: "" })
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const { data: examData, isLoading } = useQuery(
    trpc.public?.exam?.getPublicExam.queryOptions({ id }) || {
      queryKey: ["publicExam", id],
      queryFn: async () => null,
    }
  );

  const sendOtpMutation = useMutation(
    trpc.public?.exam?.sendPublicOtp.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("sendPublicOtp not available");
      },
    }
  );

  const registerMutation = useMutation(
    trpc.public?.exam?.registerParticipant.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("Public router not available");
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      class: "",
      phone: "",
      college: "",
      email: "",
      otpCode: "",
    },
  });

  const phone = form.watch("phone");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!otpSent) {
      setTempFormData(values);
      const ok = await handleSendOtp(values.phone);
      if (ok) {
        setShowOtpModal(true);
      }
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        examId: id,
        ...values,
      });
      toast.success("Registration successful! Redirecting to exam...");
      router.push(
        `/public/exams/${id}/take/${result.attemptId}?participantId=${result.participantId}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong! Maybe you have already attempted this exam.";
      toast.error(errorMessage);
    }
  }

  const handleModalSubmit = async () => {
    if (!tempFormData) return;
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        examId: id,
        ...tempFormData,
        otpCode: otpValue,
      });

      setShowOtpModal(false);
      toast.success("Registration successful! Redirecting to exam...");
      router.push(
        `/public/exams/${id}/take/${result.attemptId}?participantId=${result.participantId}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid OTP or registration failed.";
      toast.error(errorMessage);
    }
  };

  async function handleSendOtp(phoneToUse?: string) {
    const targetPhone = phoneToUse || phone || "";
    if (!targetPhone || !targetPhone.match(/^01[0-9]{9}$/)) {
      toast.error("Please enter a valid phone number first");
      return false;
    }

    // Capture current form values if we don't have them yet
    if (!tempFormData) {
      setTempFormData(form.getValues());
    }

    try {
      await sendOtpMutation.mutateAsync({ phone: targetPhone });
      setOtpSent(true);
      setTimeLeft(60);
      setShowOtpModal(true);
      toast.success("OTP sent successfully to your phone");
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!examData?.exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Exam not found</p>
      </div>
    );
  }

  const { exam } = examData;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Exam Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Public Entrance Exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 opacity-80" />
                <span>{exam.duration} Minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 opacity-80" />
                <span>{exam.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 opacity-80" />
                <span>Total Marks: {exam.total}</span>
              </div>
              {exam.hasNegativeMark && (
                <div className="flex items-center gap-3 text-red-100 bg-red-900/20 p-2 rounded">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Negative Mark: {exam.negativeMark}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Make sure you have a stable internet connection.</p>
              <p>
                • Do not switch tabs or minimize the browser during the exam.
              </p>
              <p>• The exam will be auto-submitted when the time is up.</p>
              <p>
                • You can only attempt this exam once with your phone number.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="lg:col-span-3 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Participant Registration</CardTitle>
            <CardDescription>
              Enter your details to start the exam
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class/Level</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="pl-10 w-full">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes?.map((classItem) => (
                                  <SelectItem
                                    key={classItem.id}
                                    value={classItem.name}
                                  >
                                    {classItem.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
                        <FormLabel>Phone Number</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="017XXXXXXXX"
                                className="pl-10"
                                disabled={otpSent || sendOtpMutation.isPending}
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </div>
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
                      <FormLabel>College/Institution</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Dhaka College"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={
                    registerMutation.isPending || sendOtpMutation.isPending
                  }
                >
                  {registerMutation.isPending || sendOtpMutation.isPending
                    ? "Processing..."
                    : "Verify & Start Exam"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verify Phone Number
            </DialogTitle>
            <DialogDescription>
              We&apos;ve sent a 6-digit verification code to
              <span className="font-semibold text-foreground ml-1">
                {tempFormData?.phone || phone}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-12 text-lg font-bold"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="h-4">
              {timeLeft > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Resend code in{" "}
                  <span className="font-medium">{timeLeft}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp(tempFormData?.phone)}
                  disabled={sendOtpMutation.isPending}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${sendOtpMutation.isPending ? "animate-spin" : ""}`}
                  />
                  Resend Code
                </button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full h-11"
              onClick={handleModalSubmit}
              disabled={registerMutation.isPending || otpValue.length !== 6}
            >
              {registerMutation.isPending
                ? "Verifying..."
                : "Verify & Start Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
