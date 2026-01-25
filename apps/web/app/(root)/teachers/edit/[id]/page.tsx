import { Metadata } from "next";

import { EditTeacherView } from "@/modules/teachers/ui/views/edit-teacher-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit Teacher",
  description: "Form to edit an existing Teacher",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditTeacher = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.admin.teacher.getOne.queryOptions({ id }));

  return (
    <HydrateClient>
      <EditTeacherView id={id} />
    </HydrateClient>
  );
};

export default EditTeacher;
