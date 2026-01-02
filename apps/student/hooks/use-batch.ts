import { create } from "zustand";

interface CreateBatchState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateBatch = create<CreateBatchState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditBatchState {
  isOpen: boolean;
  batchId: string;
  name: string;
  classNameId: string;
  onOpen: (batchId: string, name: string, classNameId: string) => void;
  onClose: () => void;
}

export const useEditBatch = create<EditBatchState>((set) => ({
  isOpen: false,
  batchId: "",
  name: "",
  classNameId: "",
  onOpen: (batchId, name, classNameId) =>
    set({ isOpen: true, batchId, name, classNameId }),
  onClose: () =>
    set({
      isOpen: false,
      batchId: "",
      name: "",
      classNameId: "",
    }),
}));

interface DeleteBatchState {
  isOpen: boolean;
  batchId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteBatch = create<DeleteBatchState>((set) => ({
  isOpen: false,
  batchId: "",
  onOpen: (id: string) => set({ isOpen: true, batchId: id }),
  onClose: () => set({ isOpen: false, batchId: "" }),
}));
