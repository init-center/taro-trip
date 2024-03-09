import { getStorageSyncWithTime } from "@/common/utils/storage";
import { create } from "zustand";

export interface User {
  name: string;
  phone: string;
}

interface UserStore {
  name: string;
  phone: string;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setUserInfo: (user: User) => void;
}

const userInfo = getStorageSyncWithTime<User>("userInfo");

export const useUserStore = create<UserStore>(set => ({
  name: userInfo?.name || "",
  phone: userInfo?.phone || "",
  setName: (name: string) => set({ name }),
  setPhone: (phone: string) => set({ phone }),
  setUserInfo: (user: User) =>
    set({
      name: user.name,
      phone: user.phone,
    }),
}));
