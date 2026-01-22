import { create } from "zustand";

interface CreateTopicState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateTopic = create<CreateTopicState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditTopicState {
  isOpen: boolean;
  topicId: string;
  subjectId: string;
  chapterId: string;
  name: string;
  position: string;
  onOpen: (
    topicId: string,
    subjectId: string,
    chapterId: string,
    name: string,
    position: string,
  ) => void;
  onClose: () => void;
}

export const useEditTopic = create<EditTopicState>((set) => ({
  isOpen: false,
  topicId: "",
  chapterId: "",
  name: "",
  position: "",
  subjectId: "",
  onOpen: (topicId, subjectId, chapterId, name, position) =>
    set({ isOpen: true, topicId, subjectId, chapterId, name, position }),
  onClose: () =>
    set({
      isOpen: false,
      chapterId: "",
      name: "",
      position: "",
      subjectId: "",
    }),
}));

interface DeleteTopicState {
  isOpen: boolean;
  topicId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteTopic = create<DeleteTopicState>((set) => ({
  isOpen: false,
  topicId: "",
  onOpen: (id: string) => set({ isOpen: true, topicId: id }),
  onClose: () => set({ isOpen: false, topicId: "" }),
}));
