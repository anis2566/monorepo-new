import { MCQForm } from "../form/mcqs-form";

interface NewMcqsViewProps {
  chapterId: string;
  subjectId: string;
}

export const NewMcqsView = ({ chapterId, subjectId }: NewMcqsViewProps) => {
  return <MCQForm chapterId={chapterId} subjectId={subjectId} />;
};
