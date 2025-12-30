import { Metadata } from "next";

import StudentRegistrationForm from "@/modules/student/ui/views/new-student-view";

export const metadata: Metadata = {
  title: "New Student",
  description: "New Student",
};

const NewStudent = () => {
  return (
    <div>
      <StudentRegistrationForm />
    </div>
  );
};

export default NewStudent;
