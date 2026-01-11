import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import { NewStudentForm } from "@/modules/students/ui/views/new-student-view";

export const metadata: Metadata = {
  title: "New Student",
  description: "New Student",
};

const NewStudent = () => {
  return (
    <HydrateClient>
      <NewStudentForm />
    </HydrateClient>
  );
};

export default NewStudent;
