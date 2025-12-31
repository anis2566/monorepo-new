import { create } from "zustand";

interface DeleteSubjectState {
  isOpen: boolean;
  examId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteExam = create<DeleteSubjectState>((set) => ({
  isOpen: false,
  examId: "",
  onOpen: (id: string) => set({ isOpen: true, examId: id }),
  onClose: () => set({ isOpen: false, examId: "" }),
}));
