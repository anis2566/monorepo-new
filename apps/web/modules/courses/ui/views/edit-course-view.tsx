import { EditCourseForm } from "../form/edit-course-form";

interface EditCourseViewProps {
  courseId: string;
}

export const EditCourseView = ({ courseId }: EditCourseViewProps) => {
  return <EditCourseForm courseId={courseId} />;
};
