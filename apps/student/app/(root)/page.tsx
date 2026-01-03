import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function Page() {
  return (
    <HydrateClient>
      <DashboardView />
    </HydrateClient>
  );
}
