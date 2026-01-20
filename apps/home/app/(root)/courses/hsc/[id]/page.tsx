import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { HscCourseView } from "@/modules/courses/ui/views/hsc-course-view";

export const metadata: Metadata = {
  title: "HSC Course",
  description: "HSC Course",
};

interface Props {
  params: Promise<{ id: string }>;
}

const HscCourse = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <HscCourseView courseId={id} />
    </HydrateClient>
  );
};

export default HscCourse;
