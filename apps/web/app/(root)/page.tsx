"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.auth.getMany.queryOptions());
  return (
    <div className="flex items-center justify-center min-h-svh p-8">
      <div className="flex flex-col items-center justify-center gap-6 max-w-md w-full">
        <h1 className="text-3xl font-bold tracking-tight">Database Users</h1>

        <div className="w-full space-y-2">
          {data?.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No users found in database.
            </p>
          ) : (
            data?.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
              >
                <p className="font-medium">{user.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            ))
          )}
        </div>

        <Button size="lg" className="w-full">
          Refresh View
        </Button>
      </div>
    </div>
  );
}
