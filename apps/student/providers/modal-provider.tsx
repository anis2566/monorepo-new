import { CreateClassModal } from "@/modules/class/ui/modal/create-class-modal";
import { EditClassModal } from "@/modules/class/ui/modal/edit-class-modal";
import { DeleteClassModal } from "@/modules/class/ui/modal/delete-class-modal";
import { CreateInstituteModal } from "@/modules/institute/ui/modal/create-institute-modal";
import { EditInstituteModal } from "@/modules/institute/ui/modal/edit-institute-modal";
import { DeleteInstituteModal } from "@/modules/institute/ui/modal/delete-institute-modal";
import { CreateSubjectModal } from "@/modules/subject/ui/modal/create-subject-modal";
import { EditSubjectModal } from "@/modules/subject/ui/modal/edit-subject-modal";
import { DeleteSubjectModal } from "@/modules/subject/ui/modal/delete-subject-modal";
import { CreateChapterModal } from "@/modules/chapter/ui/modal/create-chapter-modal";
import { EditChapterModal } from "@/modules/chapter/ui/modal/edit-chapter-modal";
import { DeleteChapterModal } from "@/modules/chapter/ui/modal/delete-chapter-modal";
import { DeleteStudentModal } from "@/modules/student/ui/modal/delete-student-modal";
import { CreateBatchModal } from "@/modules/batch/ui/modal/create-batch-modal";
import { EditBatchModal } from "@/modules/batch/ui/modal/edit-batch-modal";
import { DeleteBatchModal } from "@/modules/batch/ui/modal/delete-batch-modal";
import { DeleteExamModal } from "@/modules/exam/ui/modal/delete-exam-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateClassModal />
      <EditClassModal />
      <DeleteClassModal />
      <CreateInstituteModal />
      <EditInstituteModal />
      <DeleteInstituteModal />
      <CreateSubjectModal />
      <EditSubjectModal />
      <DeleteSubjectModal />
      <CreateChapterModal />
      <EditChapterModal />
      <DeleteChapterModal />
      <DeleteStudentModal />
      <CreateBatchModal />
      <EditBatchModal />
      <DeleteBatchModal />
      <DeleteExamModal />
    </>
  );
};
