import create from 'zustand';
import { useAuthStore } from './authStore';

interface Store {
  auth: ReturnType<typeof useAuthStore>;
}

export const useStore = create<Store>(() => ({
  auth: useAuthStore,
}));
