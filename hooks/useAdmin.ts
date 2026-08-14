"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { GearItem, RentalOrder, User, UserStatus, UserRole } from "@/lib/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => apiClient<User[]>(ENDPOINTS.adminUsers),
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status?: UserStatus; role?: UserRole };
    }) =>
      apiClient<User>(ENDPOINTS.adminUpdateUser(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: ["admin", "users"] });
      const prev = qc.getQueryData<User[]>(["admin", "users"]);
      if (prev) {
        qc.setQueryData<User[]>(
          ["admin", "users"],
          prev.map((u) => (u.id === id ? { ...u, ...payload } : u)),
        );
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin", "users"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin", "gear"],
    queryFn: async () => apiClient<GearItem[]>(ENDPOINTS.adminGear),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin", "rentals"],
    queryFn: async () => apiClient<RentalOrder[]>(ENDPOINTS.adminRentals),
  });
}
