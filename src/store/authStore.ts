import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Token {
  access_token: string;
  expires_in: string;
}

export interface AuthStore {
  user: null;
  logout: () => void;
  token: Token | null;
  authenticated: boolean;
  loginWithCreds: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,
        authenticated: false,

        loginWithCreds: async (creds: any) => {
          const res = await axios.post(
            'https://iras.iub.edu.bd:8079//v2/account/token',
            {
              email: creds.email,
              password: creds.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          set({ token: res.data.data[0], authenticated: true });
        },

        getUser: async () => {
          const res = await axios.get(
            'https://iras.iub.edu.bd:8079//v2/persons/userprofile',
            {
              headers: {
                Authorization: `Bearer ${get().token?.access_token}`,
              },
            }
          );
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
        name: 'token',
        getStorage: () => localStorage,
      }
    )
  )
);
