import { create } from "zustand";

interface DeleteUserState {
  isOpen: boolean;
  userId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteUser = create<DeleteUserState>((set) => ({
  isOpen: false,
  userId: "",
  onOpen: (id: string) => set({ isOpen: true, userId: id }),
  onClose: () => set({ isOpen: false, userId: "" }),
}));
