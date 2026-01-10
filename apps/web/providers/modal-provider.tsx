import { DeleteClassModal } from "@/modules/class/ui/modal/delete-class-modal";
import { CreateInstituteModal } from "@/modules/institutes/ui/modal/create-institute-modal";
import { EditInstituteModal } from "@/modules/institutes/ui/modal/edit-institute-modal";
import { DeleteInstituteModal } from "@/modules/institute/ui/modal/delete-institute-modal";
import { EditSubjectModal } from "@/modules/subjects/ui/modal/edit-subject-modal";
import { DeleteSubjectModal } from "@/modules/subject/ui/modal/delete-subject-modal";
import { CreateChapterModal } from "@/modules/chapters/ui/modal/create-chapter-modal";
import { EditChapterModal } from "@/modules/chapters/ui/modal/edit-chapter-modal";
import { DeleteChapterModal } from "@/modules/chapter/ui/modal/delete-chapter-modal";
import { DeleteStudentModal } from "@/modules/student/ui/modal/delete-student-modal";
import { CreateBatchModal } from "@/modules/batches/ui/modal/create-batch-modal";
import { EditBatchModal } from "@/modules/batches/ui/modal/edit-batch-modal";
import { DeleteBatchModal } from "@/modules/batch/ui/modal/delete-batch-modal";
import { DeleteExamModal } from "@/modules/exam/ui/modal/delete-exam-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { ChangeUserRoleModal } from "@/modules/users/ui/modal/change-role-modal";
import { CreateClassModal } from "@/modules/classes/ui/modal/create-class-modal";
import { EditClassModal } from "@/modules/classes/ui/modal/edit-class-modal";
import { CreateSubjectModal } from "@/modules/subjects/ui/modal/create-subject-modal";

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
      <DeleteConfirmModal />
      <ChangeUserRoleModal />
    </>
  );
};
