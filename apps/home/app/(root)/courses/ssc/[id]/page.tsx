import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { SscCourseView } from "@/modules/courses/ui/views/ssc-course-view";

export const metadata: Metadata = {
  title: "SSC Course",
  description: "SSC Course",
};

interface Props {
  params: Promise<{ id: string }>;
}

const SscCourse = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <SscCourseView courseId={id} />
    </HydrateClient>
  );
};

export default SscCourse;
