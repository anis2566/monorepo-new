"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SignInView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const router = useRouter();

  const isPending = isEmailLoading || isSocialLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsEmailLoading(true);

      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        console.error("Sign in error:", result.error);
        toast.error(result.error.message);
        return;
      }

      if (result.data?.user) {
        toast.success("Signed in successfully!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue to your account
            </p>
          </div>

          {/* Google Button */}
          <GoogleButton
            onClick={handleGoogleSignIn}
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

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className={cn(
                    "text-sm text-primary hover:text-primary/80 transition-colors",
                    isPending && "pointer-events-none opacity-50"
                  )}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                {isEmailLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* Sign up link */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className={cn(
              "text-primary hover:text-primary/80 font-medium transition-colors",
              isPending && "pointer-events-none opacity-50"
            )}
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
