import { CreateClassModal } from "@/modules/class/ui/modal/create-class-modal";
import { EditClassModal } from "@/modules/class/ui/modal/edit-class-modal";
import { DeleteClassModal } from "@/modules/class/ui/modal/delete-class-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateClassModal />
      <EditClassModal />
      <DeleteClassModal />
    </>
  );
};
