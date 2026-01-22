import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import { CourseView } from "@/modules/courses/ui/views/course-view";

export const metadata: Metadata = {
  title: "Course Details",
  description: "Course Details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Course = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <CourseView courseId={id} />
    </HydrateClient>
  );
};

export default Course;
