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
  level: string;
  onOpen: (subjectId: string, name: string, level: string) => void;
  onClose: () => void;
}

export const useEditSubject = create<EditSubjectState>((set) => ({
  isOpen: false,
  subjectId: "",
  name: "",
  level: "",
  onOpen: (subjectId, name, level) =>
    set({ isOpen: true, subjectId, name, level }),
  onClose: () =>
    set({
      isOpen: false,
      subjectId: "",
      name: "",
      level: "",
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
