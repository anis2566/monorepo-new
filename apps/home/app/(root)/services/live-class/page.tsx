import { Metadata } from "next";

import { LiveClassServices } from "@/modules/services/ui/views/live-class-service";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Live Class",
  description: "Live Class",
};

const LiveClassPage = () => {
  return (
    <HydrateClient>
      <LiveClassServices />
    </HydrateClient>
  );
};

export default LiveClassPage;
