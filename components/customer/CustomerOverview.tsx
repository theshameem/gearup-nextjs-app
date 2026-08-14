"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { ReviewDialog } from "@/components/rental/ReviewDialog";
import { useMyRentals } from "@/hooks/useRentals";
import { useCreateCheckout } from "@/hooks/usePayments";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatCurrency, formatDate, daysBetween } from "@/lib/format";
import type { RentalOrder, RentalStatus } from "@/lib/types";

export function CustomerOverview() {
  const rentals = useMyRentals();
  const createCheckout = useCreateCheckout();
  const [reviewFor, setReviewFor] = useState<{ order: RentalOrder; gearItemId: string; gearName: string } | null>(null);

  const totalRentals = rentals.data?.length ?? 0;
  const activeStatuses: RentalStatus[] = ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"];
  const active = rentals.data?.filter((r) => activeStatuses.includes(r.status)).length ?? 0;
  const totalSpent = rentals.data?.reduce((sum, r) => sum + Number(r.totalAmount ?? 0), 0) ?? 0;

  async function onPay(orderId: string) {
    try {
      const res = await createCheckout.mutateAsync(orderId);
      // Stripe-hosted checkout URL — external redirect (allowed by spec §9.1)
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = res.paymentUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening with your rentals.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total rentals" value={String(totalRentals)} />
        <Stat label="Active rentals" value={String(active)} />
        <Stat label="Total spent" value={formatCurrency(totalSpent)} />
      </div>

      <section id="orders">
        <h2 className="mb-3 text-lg font-semibold">My rentals</h2>
        {rentals.isLoading ? (
          <Table>
            <THead>
              <TR>
                <TH>Order</TH>
                <TH>Gear</TH>
                <TH>Dates</TH>
                <TH>Status</TH>
                <TH>Total</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTableRow key={i} cols={6} />
              ))}
            </TBody>
          </Table>
        ) : !rentals.data || rentals.data.length === 0 ? (
          <EmptyState
            title="No rentals yet"
            description="Find your next adventure and place your first rental."
            cta={{ label: "Browse gear", href: "/gear" }}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Order</TH>
                <TH>Gear</TH>
                <TH>Dates</TH>
                <TH>Status</TH>
                <TH>Total</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {rentals.data.map((r) => {
                const item = r.items?.[0];
                return (
                  <TR key={r.id}>
                    <TD>
                      <div className="font-mono text-xs">{r.orderNumber}</div>
                    </TD>
                    <TD>
                      {item ? (
                        <Link href={`/gear/${item.gearItemId}`} className="font-medium hover:underline">
                          {item.gearItem?.name ?? "Gear"}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TD>
                    <TD>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(r.rentalStartDate)} – {formatDate(r.rentalEndDate)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {daysBetween(r.rentalStartDate, r.rentalEndDate)} days
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <RentalStatusBadge status={r.status} />
                    </TD>
                    <TD className="font-semibold">{formatCurrency(r.totalAmount)}</TD>
                    <TD>
                      <RentalActions
                        order={r}
                        onPay={() => onPay(r.id)}
                        onReview={() =>
                          item &&
                          setReviewFor({
                            order: r,
                            gearItemId: item.gearItemId,
                            gearName: item.gearItem?.name ?? "gear",
                          })
                        }
                      />
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </section>

      {reviewFor ? (
        <ReviewDialog
          open={!!reviewFor}
          onClose={() => setReviewFor(null)}
          gearItemId={reviewFor.gearItemId}
          rentalOrderId={reviewFor.order.id}
          gearName={reviewFor.gearName}
        />
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function RentalActions({
  order,
  onReview,
}: {
  order: RentalOrder;
  onPay: () => void;
  onReview: () => void;
}) {
  const router = useRouter();
  switch (order.status) {
    case "PLACED":
      return <span className="text-xs text-slate-500">Awaiting provider confirmation</span>;
    case "CONFIRMED":
      return (
        <Button size="sm" onClick={() => router.push(`/dashboard/customer/orders/${order.id}/pay`)}>
          Pay now
        </Button>
      );
    case "PAID":
      return <span className="text-xs text-slate-500">Awaiting pickup</span>;
    case "PICKED_UP":
      return <span className="text-xs text-slate-500">Return window ends {formatDate(order.rentalEndDate)}</span>;
    case "RETURNED":
      return (
        <Button size="sm" variant="outline" onClick={onReview}>
          <Star className="h-3.5 w-3.5" /> Leave review
        </Button>
      );
    case "CANCELLED":
      return <span className="text-xs text-slate-400">Cancelled</span>;
    default:
      return null;
  }
}
