"use client";

import { create } from "zustand";
import { clearToken, readToken, readUserJson, writeToken, writeUserJson } from "./token";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,
  setSession: (user, token) => {
    writeToken(token);
    writeUserJson(user);
    set({ user, accessToken: token });
  },
  setUser: (user) => {
    if (user) writeUserJson(user);
    set({ user });
  },
  setToken: (token) => {
    if (token) writeToken(token);
    else clearToken();
    set({ accessToken: token });
  },
  logout: () => {
    clearToken();
    set({ user: null, accessToken: null });
  },
  hydrate: () => {
    const token = readToken();
    const user = readUserJson<User>();
    set({ accessToken: token, user, hydrated: true });
  },
}));
