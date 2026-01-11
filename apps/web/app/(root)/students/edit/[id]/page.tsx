import { EditStudentForm } from "@/modules/students/ui/views/edit-student-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Student",
  description: "Form to edit an existing Student",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditStudent = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.admin.student.getOne.queryOptions(id));

  return (
    <HydrateClient>
      <EditStudentForm studentId={id} />
    </HydrateClient>
  );
};

export default EditStudent;
