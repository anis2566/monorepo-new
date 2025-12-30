import { create } from "zustand";

interface CreateChapterState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateChapter = create<CreateChapterState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditChapterState {
  isOpen: boolean;
  chapterId: string;
  name: string;
  position: string;
  subjectId: string;
  onOpen: (chapterId: string, name: string, position: string, subjectId: string) => void;
  onClose: () => void;
}

export const useEditChapter = create<EditChapterState>((set) => ({
  isOpen: false,
  chapterId: "",
  name: "",
  position: "",
  subjectId: "",
  onOpen: (chapterId, name, position, subjectId) =>
    set({ isOpen: true, chapterId, name, position, subjectId }),
  onClose: () =>
    set({
      isOpen: false,
      chapterId: "",
      name: "",
      position: "",
      subjectId: "",
    }),
}));

interface DeleteChapterState {
  isOpen: boolean;
  chapterId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteChapter = create<DeleteChapterState>((set) => ({
  isOpen: false,
  chapterId: "",
  onOpen: (id: string) => set({ isOpen: true, chapterId: id }),
  onClose: () => set({ isOpen: false, chapterId: "" }),
}));
