"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateCheckout } from "@/hooks/usePayments";
import { useRentalDetail } from "@/hooks/useRentals";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { formatCurrency, formatDate, daysBetween } from "@/lib/format";
import Link from "next/link";

export function PayPageClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const checkout = useCreateCheckout();
  const { data, isLoading } = useRentalDetail(orderId);
  const [loading, setLoading] = useState(false);

  async function onPay() {
    setLoading(true);
    try {
      const res = await checkout.mutateAsync(orderId);
      window.location.href = res.paymentUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not start checkout";
      toast.error(message);
      setLoading(false);
    }
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }
  if (!data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        Could not load this rental.
        <Link href="/dashboard/customer" className="ml-2 underline">Back to dashboard</Link>
      </div>
    );
  }

  const days = daysBetween(data.rentalStartDate, data.rentalEndDate);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pay for your rental</h1>
        <p className="text-sm text-slate-500">Order #{data.orderNumber}</p>
      </div>

      <Card className="divide-y divide-slate-200 dark:divide-slate-800">
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-slate-500">Status</span>
          <RentalStatusBadge status={data.status} />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-slate-500">Dates</span>
          <span className="text-sm">
            {formatDate(data.rentalStartDate)} – {formatDate(data.rentalEndDate)} ({days} days)
          </span>
        </div>
        {data.pickupAddress ? (
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-slate-500">Pickup</span>
            <span className="text-sm">{data.pickupAddress}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-slate-500">Deposit</span>
          <span className="text-sm">{formatCurrency(data.depositAmount)}</span>
        </div>
        <div className="flex items-center justify-between p-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(data.totalAmount)}</span>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="font-semibold">Stripe Checkout</span>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          You&apos;ll be redirected to Stripe to complete payment securely. Your card details never touch our servers.
        </p>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/customer")}>
            Cancel
          </Button>
          <Button onClick={onPay} disabled={loading || data.status !== "CONFIRMED"}>
            {loading ? "Redirecting…" : `Pay ${formatCurrency(data.totalAmount)}`}
          </Button>
        </div>
        {data.status !== "CONFIRMED" ? (
          <p className="mt-2 text-xs text-amber-600">
            This rental is not yet confirmed by the provider. You&apos;ll be able to pay once it is.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
