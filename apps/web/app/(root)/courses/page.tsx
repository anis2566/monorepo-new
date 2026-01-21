import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import { CoursesView } from "@/modules/courses/ui/views/courses-view";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses",
};

const Courses = async () => {
  return (
    <HydrateClient>
      <CoursesView />
    </HydrateClient>
  );
};

export default Courses;
