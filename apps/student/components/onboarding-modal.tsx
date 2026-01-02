"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const OnBoardingModal = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.user.getVerifiedUser.queryOptions());

  return <div>On Boarding Modal</div>;
};
