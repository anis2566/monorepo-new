"use client";

import { use } from "react";
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
  BookOpen,
  GraduationCap,
  Phone,
  User,
  Building2,
  Clock,
  HelpCircle,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  class: z.string().min(1, "Class is required"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid phone number format (e.g., 01712345678)"),
  college: z.string().min(2, "College name is required"),
  email: z.string().email().optional().or(z.literal("")),
});

interface PublicExamPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicExamPage({ params }: PublicExamPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const trpc = useTRPC();

  const { data: examData, isLoading } = useQuery(
    trpc.public?.exam?.getPublicExam.queryOptions({ id }) || {
      queryKey: ["publicExam", id],
      queryFn: async () => null,
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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
                            <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="HSC 2025"
                              className="pl-10"
                              {...field}
                            />
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
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="017XXXXXXXX"
                              className="pl-10"
                              {...field}
                            />
                          </div>
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Processing..."
                    : "Start Exam Now"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
