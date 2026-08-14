"use client";

import { useAuthStore } from "./auth-store";
import { API_BASE } from "./api-base";
import type { ApiEnvelope } from "./types";

export { API_BASE };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiClient<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      const next = window.location.pathname + window.location.search;
      // External redirect from a fetch handler — no router available here.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/auth/login?next=${encodeURIComponent(next)}`;
    }
    throw new ApiError("Unauthenticated", 401);
  }

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(`Invalid response (${res.status})`, res.status);
  }

  if (!res.ok || !json || !json.success) {
    throw new ApiError(
      json?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return json.data as T;
}

export async function apiClientRaw<T>(path: string, init?: RequestInit): Promise<T> {
  return apiClient<T>(path, init);
}
