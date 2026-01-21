import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { MedicalCourseView } from "@/modules/courses/ui/views/medical-course-view";

export const metadata: Metadata = {
  title: "Medical Course",
  description: "Medical Course",
};

interface Props {
  params: Promise<{ id: string }>;
}

const MedicalCourse = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <MedicalCourseView courseId={id} />
    </HydrateClient>
  );
};

export default MedicalCourse;
