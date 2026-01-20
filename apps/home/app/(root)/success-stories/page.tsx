import { Metadata } from "next";

import { SuccessStoriesView } from "@/modules/success-stories/ui/views/success-stories-view";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Success Stories",
};

const SuccessStories = () => {
  return <SuccessStoriesView />;
};

export default SuccessStories;
