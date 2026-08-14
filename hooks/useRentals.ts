"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreateRentalPayload, RentalOrder } from "@/lib/types";

export function useMyRentals() {
  return useQuery({
    queryKey: ["rentals", "mine"],
    queryFn: async () => apiClient<RentalOrder[]>(ENDPOINTS.myRentals),
  });
}

export function useRentalDetail(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: async () => apiClient<RentalOrder>(ENDPOINTS.rentalDetail(id)),
    enabled: !!id,
  });
}

export function useCreateRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalPayload) =>
      apiClient<RentalOrder>(ENDPOINTS.createRental, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rentals", "mine"] });
    },
  });
}
