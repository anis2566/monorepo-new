"use client";

import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { BookOpen, Phone, Send, User } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

interface ClassPhoneIdStepProps {
  onNext: (data: { classLevel: string; phone: string }) => void;
  onBack: () => void;
}

const formSchema = z.object({
  classLevel: z.string().min(1, "Please select your class"),
  phone: z.string().length(11, "Enter a valid 11-digit phone number"),
  studentId: z.string().min(1, "Student ID is required"),
});

export const ClassPhoneIdStep = ({ onNext, onBack }: ClassPhoneIdStepProps) => {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.admin.class.forSelect.queryOptions({ search: "" })
  );

  const { mutate: sendVerificationCode, isPending } = useMutation(
    trpc.user.sendVerificationSms.mutationOptions({
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
          onNext({
            classLevel: form.getValues("classLevel"),
            phone: form.getValues("phone"),
          });
        }
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classLevel: "",
      phone: "",
      studentId: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    sendVerificationCode(data);
  };

  return (
    <div className="flex flex-col px-4 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Your Details</h2>
        <p className="text-sm text-muted-foreground">
          Help us personalize your experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="classLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Select Your Class
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full py-5">
                    <SelectValue placeholder="Choose your class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg z-50">
                    {data?.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <User className="w-4 h-4 text-primary" />
                  Student ID
                </FormLabel>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-11"
                  disabled={isPending}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </FormLabel>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-11"
                  disabled={isPending}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-8 space-y-3">
            <Button
              variant="default"
              size="lg"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex-1"
              disabled={form.formState.isSubmitting || isPending}
              type="submit"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Send Verification Code
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="default"
              onClick={onBack}
              className="w-full hover:bg-muted hover:text-black"
              disabled={form.formState.isSubmitting || isPending}
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
