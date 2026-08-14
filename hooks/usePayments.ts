"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreateCheckoutResponse, Payment } from "@/lib/types";

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payments", "history"],
    queryFn: async () => apiClient<Payment[]>(ENDPOINTS.payments),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (rentalOrderId: string) =>
      apiClient<CreateCheckoutResponse>(ENDPOINTS.createCheckout, {
        method: "POST",
        body: JSON.stringify({ rentalOrderId }),
      }),
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      apiClient<Payment>(ENDPOINTS.confirmPayment, {
        method: "POST",
        body: JSON.stringify({ transactionId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}
