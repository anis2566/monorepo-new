import { create } from "zustand";

interface ChangeRoleState {
  isOpen: boolean;
  userId: string;
  currentRole: string;
  email: string;
  name?: string;
  image?: string;
  onOpen: (
    userId: string,
    role: string,
    email: string,
    name?: string,
    image?: string
  ) => void;
  onClose: () => void;
}

export const useChangeRole = create<ChangeRoleState>((set) => ({
  isOpen: false,
  userId: "",
  currentRole: "",
  email: "",
  name: undefined,
  image: undefined,
  onOpen: (
    userId: string,
    role: string,
    email: string,
    name?: string,
    image?: string
  ) =>
    set({
      isOpen: true,
      userId,
      currentRole: role,
      email,
      name,
      image,
    }),
  onClose: () =>
    set({
      isOpen: false,
      userId: "",
      currentRole: "",
      email: "",
      name: undefined,
      image: undefined,
    }),
}));

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
