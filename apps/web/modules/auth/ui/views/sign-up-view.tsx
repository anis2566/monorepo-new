"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { FormInput } from "@workspace/ui/shared/form-input";
import { authClient } from "@/auth/client";

import { GoogleButton } from "../components/google-button";
import { Divider } from "../components/divider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface PasswordRequirement {
  label: string;
  met: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignUpView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const router = useRouter();

  const isPending = isEmailLoading || isSocialLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password");

  const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password || "") },
    { label: "Contains uppercase", met: /[A-Z]/.test(password || "") },
  ];

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsEmailLoading(true);

      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        console.error("Sign up error:", result.error);
        toast.error(result.error.message);
        return;
      }

      if (result.data?.user) {
        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSocialLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 space-y-6 border border-white/10 shadow-2xl shadow-black/20"
        >
          {/* Logo / Brand */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Mr. Dr.
            </h2>
            <h1 className="text-xl font-semibold text-white">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Get started with your free account today
            </p>
          </div>

          {/* Google Button */}
          <GoogleButton
            onClick={handleGoogleSignUp}
            isLoading={isSocialLoading}
          />

          {/* Divider */}
          <Divider text="or" />

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormInput
                name="name"
                label="Full name"
                type="text"
                placeholder="Enter your full name"
                className="h-12 text-white"
                disabled={isPending}
              />

              <FormInput
                name="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
                className="h-12 text-white"
                disabled={isPending}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 text-white"
                          disabled={isPending}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password requirements */}
              {password && password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                          req.met
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span
                        className={
                          req.met ? "text-green-500" : "text-muted-foreground"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                {isEmailLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link
                  href="/terms"
                  className={cn(
                    "text-primary hover:text-primary/80",
                    isPending && "pointer-events-none opacity-50"
                  )}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className={cn(
                    "text-primary hover:text-primary/80",
                    isPending && "pointer-events-none opacity-50"
                  )}
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </Form>
        </motion.div>

        {/* Sign in link */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className={cn(
              "text-primary hover:text-primary/80 font-medium transition-colors",
              isPending && "pointer-events-none opacity-50"
            )}
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
