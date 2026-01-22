import { CreateInstituteModal } from "@/modules/institutes/ui/modal/create-institute-modal";
import { EditInstituteModal } from "@/modules/institutes/ui/modal/edit-institute-modal";
import { EditSubjectModal } from "@/modules/subjects/ui/modal/edit-subject-modal";
import { CreateChapterModal } from "@/modules/chapters/ui/modal/create-chapter-modal";
import { EditChapterModal } from "@/modules/chapters/ui/modal/edit-chapter-modal";
import { CreateBatchModal } from "@/modules/batches/ui/modal/create-batch-modal";
import { EditBatchModal } from "@/modules/batches/ui/modal/edit-batch-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { ChangeUserRoleModal } from "@/modules/users/ui/modal/change-role-modal";
import { CreateClassModal } from "@/modules/classes/ui/modal/create-class-modal";
import { EditClassModal } from "@/modules/classes/ui/modal/edit-class-modal";
import { CreateSubjectModal } from "@/modules/subjects/ui/modal/create-subject-modal";
import { CreateTopicModal } from "@/modules/topic/ui/modal/create-topic-modal";
import { EditTopicModal } from "@/modules/topic/ui/modal/edit-topic-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateClassModal />
      <EditClassModal />
      <CreateInstituteModal />
      <EditInstituteModal />
      <CreateSubjectModal />
      <EditSubjectModal />
      <CreateChapterModal />
      <EditChapterModal />
      <CreateBatchModal />
      <EditBatchModal />
      <DeleteConfirmModal />
      <ChangeUserRoleModal />
      <CreateTopicModal />
      <EditTopicModal />
    </>
  );
};
