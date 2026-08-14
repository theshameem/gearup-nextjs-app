"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      rentalOrderId: string;
      gearItemId: string;
      rating: number;
      comment?: string;
    }) =>
      apiClient<unknown>(ENDPOINTS.createReview, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["gear", vars.gearItemId] });
      qc.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}
