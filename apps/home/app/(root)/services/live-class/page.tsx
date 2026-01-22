import { Metadata } from "next";

import { LiveClassServices } from "@/modules/services/ui/views/live-class-service";

export const metadata: Metadata = {
  title: "Live Class",
  description: "Live Class",
};

const LiveClassPage = () => {
  return <LiveClassServices />;
};

export default LiveClassPage;
