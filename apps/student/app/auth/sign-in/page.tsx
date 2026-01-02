import { Metadata } from "next";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const SignIn = () => {
  return <SignInView />;
};

export default SignIn;
