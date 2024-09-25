import axios from "axios";
import { createStore } from "zustand/vanilla";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export type Token = {
  expires_in: string;
  access_token: string;
};

export type AuthState = {
  user: null;
  token: Token | null;
  authenticated: boolean;
};

export type AuthActions = {
  logout: () => void;
  getUser: () => void;
  getToken: () => string | undefined;
  loginWithCreds: (email: string, password: string) => Promise<void>;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  user: null,
  token: null,
  authenticated: false,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()(
    devtools(
      persist(
        (set, get) => ({
          user: null,
          token: null,
          authenticated: false,

          loginWithCreds: async (creds: any) => {
            try {
              const res = await axios.post("/api/login", {
                email: creds.email,
                password: creds.password,
              });
              set({ token: res.data.data[0], authenticated: true });
            } catch (error) {
              console.error(error);
            }
          },

          getUser: async () => {
            const res = await axios.get("https://iras.iub.edu.bd:8079//v2/persons/userprofile", {
              headers: {
                Authorization: `Bearer ${get().token?.access_token}`,
              },
            });
            set({ user: res.data.data[0] });
            console.log(res.data.data[0]);
          },

          logout: () => {
            set({ token: null, authenticated: false });
          },

          getToken: () => {
            return get().token?.access_token;
          },
        }),
        {
          name: "token",
          storage: createJSONStorage(() => localStorage),
        }
      )
    )
  );
};
