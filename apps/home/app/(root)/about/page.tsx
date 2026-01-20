import { Metadata } from "next";

import { AboutView } from "@/modules/about/ui/views/about-view";

export const metadata: Metadata = {
  title: "About",
  description: "About",
};

const About = () => {
  return <AboutView />;
};

export default About;
