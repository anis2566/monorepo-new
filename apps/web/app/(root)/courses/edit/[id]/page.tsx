import { Metadata } from "next";

import { EditCourseView } from "@/modules/courses/ui/views/edit-course-view";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Form to edit an existing Course",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditCourse = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <HydrateClient>
      <EditCourseView courseId={id} />
    </HydrateClient>
  );
};

export default EditCourse;
