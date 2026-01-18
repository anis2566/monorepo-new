import { HomeView } from "@/modules/home/ui/views/home-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function Page() {
  return <HomeView />;
}
