import { CreateClassModal } from "@/modules/class/ui/modal/create-class-modal";
import { EditClassModal } from "@/modules/class/ui/modal/edit-class-modal";
import { DeleteClassModal } from "@/modules/class/ui/modal/delete-class-modal";
import { CreateInstituteModal } from "@/modules/institute/ui/modal/create-institute-modal";
import { EditInstituteModal } from "@/modules/institute/ui/modal/edit-institute-modal";
import { DeleteInstituteModal } from "@/modules/institute/ui/modal/delete-institute-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateClassModal />
      <EditClassModal />
      <DeleteClassModal />
      <CreateInstituteModal />
      <EditInstituteModal />
      <DeleteInstituteModal />
    </>
  );
};
