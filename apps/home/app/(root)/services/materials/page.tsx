import { Metadata } from "next";

import { MaterialsServices } from "@/modules/services/ui/views/materials-service";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Materials",
  description: "Materials",
};

const MaterialsPage = () => {
  return (
    <HydrateClient>
      <MaterialsServices />
    </HydrateClient>
  );
};

export default MaterialsPage;
