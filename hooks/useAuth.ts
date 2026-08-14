"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { useAuthStore } from "@/lib/auth-store";
import type { LoginResponse, User } from "@/lib/types";

export function useMe(enabled = true) {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["me"],
    enabled,
    queryFn: async () => {
      const user = await apiClient<User>(ENDPOINTS.me);
      setUser(user);
      return user;
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const setToken = useAuthStore((s) => s.setToken);
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      apiClient<LoginResponse>(ENDPOINTS.login, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      if (data.user) {
        setSession(data.user, data.accessToken);
      } else if (data.accessToken) {
        setToken(data.accessToken);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: {
      name: string;
      email: string;
      password: string;
      role: "CUSTOMER" | "PROVIDER";
      profileImage?: string;
      phone?: string;
      address?: string;
    }) =>
      apiClient<unknown>(ENDPOINTS.register, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    qc.clear();
  };
}
