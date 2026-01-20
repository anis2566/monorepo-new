import { Metadata } from "next";

import { CoursesView } from "@/modules/courses/ui/views/courses-view";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses",
};

const Courses = () => {
  return <CoursesView />;
};

export default Courses;
