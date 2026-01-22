import { Metadata } from "next";

import { MaterialsServices } from "@/modules/services/ui/views/materials-service";

export const metadata: Metadata = {
  title: "Materials",
  description: "Materials",
};

const MaterialsPage = () => {
  return <MaterialsServices />;
};

export default MaterialsPage;
