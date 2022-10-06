import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'token',
      getStorage: () => localStorage,
    }
  )
);
