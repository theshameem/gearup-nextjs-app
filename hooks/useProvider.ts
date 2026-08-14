"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreateGearPayload, GearItem, RentalOrder } from "@/lib/types";
import { useProviderGearCache } from "./useProviderCache";

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider", "orders"],
    queryFn: async () => apiClient<RentalOrder[]>(ENDPOINTS.providerOrders),
  });
}

export function useProviderGearLocal() {
  const items = useProviderGearCache((s) => s.items);
  return items;
}

export function useAddGear() {
  const qc = useQueryClient();
  const add = useProviderGearCache((s) => s.add);
  return useMutation({
    mutationFn: (payload: CreateGearPayload) =>
      apiClient<GearItem>(ENDPOINTS.providerAddGear, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (gear) => {
      add(gear);
      qc.invalidateQueries({ queryKey: ["provider", "orders"] });
    },
  });
}

export function useUpdateGear() {
  const qc = useQueryClient();
  const update = useProviderGearCache((s) => s.update);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateGearPayload> }) =>
      apiClient<GearItem>(ENDPOINTS.providerUpdateGear(id), {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (gear) => {
      update(gear.id, gear);
      qc.invalidateQueries({ queryKey: ["provider", "orders"] });
    },
  });
}

export function useDeleteGear() {
  const qc = useQueryClient();
  const remove = useProviderGearCache((s) => s.remove);
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<unknown>(ENDPOINTS.providerDeleteGear(id), { method: "DELETE" }),
    onSuccess: (_data, id) => {
      remove(id);
      qc.invalidateQueries({ queryKey: ["provider", "orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalOrder["status"] }) =>
      apiClient<RentalOrder>(ENDPOINTS.providerUpdateOrder(id), {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["provider", "orders"] });
      const prev = qc.getQueryData<RentalOrder[]>(["provider", "orders"]);
      if (prev) {
        qc.setQueryData<RentalOrder[]>(
          ["provider", "orders"],
          prev.map((o) => (o.id === id ? { ...o, status } : o)),
        );
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["provider", "orders"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["provider", "orders"] });
    },
  });
}
