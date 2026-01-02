import { Metadata } from "next";

import { StudentsView } from "@/modules/student/ui/views/students-view";
import { SearchParams } from "nuqs";
import { getStudents } from "@/modules/student/filters/get-students";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Students",
  description: "Students",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Students = async ({ searchParams }: Props) => {
  const params = await getStudents(searchParams);

  prefetch(trpc.admin.student.getMany.queryOptions(params));

  return (
    <HydrateClient>
      <StudentsView />
    </HydrateClient>
  );
};

export default Students;
