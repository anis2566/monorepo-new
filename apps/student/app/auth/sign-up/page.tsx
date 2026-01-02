import { Metadata } from "next";

import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account",
};

const SignUp = () => {
  return <SignUpView />;
};

export default SignUp;
