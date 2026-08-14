"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "gearup_token";
const USER_KEY = "gearup_user";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function writeToken(token: string) {
  if (typeof window === "undefined") return;
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "lax",
    path: "/",
  });
}

export function clearToken() {
  if (typeof window === "undefined") return;
  Cookies.remove(TOKEN_KEY, { path: "/" });
  try {
    window.localStorage.removeItem(USER_KEY);
  } catch {
    /* noop */
  }
}

export function readUserJson<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeUserJson(value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(value));
  } catch {
    /* noop */
  }
}
