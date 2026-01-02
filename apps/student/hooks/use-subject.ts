import { create } from "zustand";

interface CreateSubjectState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateSubject = create<CreateSubjectState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditSubjectState {
  isOpen: boolean;
  subjectId: string;
  name: string;
  group: string;
  onOpen: (subjectId: string, name: string, group: string) => void;
  onClose: () => void;
}

export const useEditSubject = create<EditSubjectState>((set) => ({
  isOpen: false,
  subjectId: "",
  name: "",
  group: "",
  onOpen: (subjectId, name, group) =>
    set({ isOpen: true, subjectId, name, group }),
  onClose: () =>
    set({
      isOpen: false,
      subjectId: "",
      name: "",
      group: "",
    }),
}));

interface DeleteSubjectState {
  isOpen: boolean;
  subjectId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteSubject = create<DeleteSubjectState>((set) => ({
  isOpen: false,
  subjectId: "",
  onOpen: (id: string) => set({ isOpen: true, subjectId: id }),
  onClose: () => set({ isOpen: false, subjectId: "" }),
}));
