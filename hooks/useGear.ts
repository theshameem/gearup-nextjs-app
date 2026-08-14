"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { buildQueryString } from "@/lib/utils";
import type { Category, GearDetail, GearFilters, GearItem, ListResponse } from "@/lib/types";

export function useGearList(filters: GearFilters) {
  return useQuery({
    queryKey: ["gear", filters],
    queryFn: async () => {
      const res = await apiClient<ListResponse<GearItem>>(
        ENDPOINTS.gearList + buildQueryString(filters as Record<string, unknown>),
      );
      return { items: res.result, count: res.count };
    },
  });
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: async () => {
      const res = await apiClient<{ result: GearDetail }>(ENDPOINTS.gearDetail(id));
      return res.result;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient<ListResponse<Category>>(ENDPOINTS.categories);
      return res.result;
    },
    staleTime: 5 * 60_000,
  });
}
