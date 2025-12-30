"use client";

import StudentRegistrationForm from "@/modules/student/ui/views/new-student-view";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.auth.getMany.queryOptions());
  return (
    <div className="flex items-center justify-center min-h-svh p-8">
      <StudentRegistrationForm />
    </div>
  );
}
