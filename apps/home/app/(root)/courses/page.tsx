import { Metadata } from "next";

import { CoursesView } from "@/modules/courses/ui/views/courses-view";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses",
};

const Courses = () => {
  return (
    <HydrateClient>
      <CoursesView />
    </HydrateClient>
  );
};

export default Courses;
