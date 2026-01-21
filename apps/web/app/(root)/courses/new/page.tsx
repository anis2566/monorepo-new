import type { Metadata } from "next";

import { NewCourseView } from "@/modules/courses/ui/views/new-course-view";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "New Course",
  description: "Create a new Course",
};

const NewCourse = () => {
  return (
    <HydrateClient>
      <NewCourseView />
    </HydrateClient>
  );
};

export default NewCourse;
