import { EditExamForm } from "../form/edit-exam-form";

interface EditExamViewProps {
  examId: string;
}

export const EditExamView = ({ examId }: EditExamViewProps) => {
  return <EditExamForm examId={examId} />;
};
