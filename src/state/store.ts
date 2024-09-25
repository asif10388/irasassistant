import { createStore } from "zustand/vanilla";
import { createAuthStore } from "./authStore";

interface Store {
  auth: ReturnType<typeof createAuthStore>;
}

export const useStore = createStore<Store>(() => ({
  auth: createAuthStore(),
}));
