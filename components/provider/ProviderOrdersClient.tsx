"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { useProviderOrders, useUpdateOrderStatus } from "@/hooks/useProvider";
import { formatCurrency, formatDate, daysBetween } from "@/lib/format";
import type { RentalOrder, RentalStatus } from "@/lib/types";

const NEXT_ACTIONS: Record<RentalStatus, { to: RentalStatus; label: string; variant?: "default" | "outline" | "destructive" }[]> = {
  PLACED: [
    { to: "CONFIRMED", label: "Confirm" },
    { to: "CANCELLED", label: "Cancel", variant: "destructive" },
  ],
  CONFIRMED: [
    { to: "PAID", label: "Mark paid" },
    { to: "CANCELLED", label: "Cancel", variant: "destructive" },
  ],
  PAID: [
    { to: "PICKED_UP", label: "Mark picked up" },
    { to: "CANCELLED", label: "Cancel", variant: "destructive" },
  ],
  PICKED_UP: [{ to: "RETURNED", label: "Mark returned" }],
  RETURNED: [],
  CANCELLED: [],
};

export function ProviderOrdersClient() {
  const orders = useProviderOrders();
  const update = useUpdateOrderStatus();

  async function transition(id: string, status: RentalStatus) {
    try {
      await update.mutateAsync({ id, status });
      toast.success(`Status updated to ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Incoming orders</h1>
        <p className="text-sm text-slate-500">Confirm rentals, mark payments, pickups, and returns.</p>
      </div>

      {orders.isLoading ? (
        <Table>
          <THead>
            <TR>
              <TH>Order</TH>
              <TH>Customer</TH>
              <TH>Gear</TH>
              <TH>Dates</TH>
              <TH>Status</TH>
              <TH>Total</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={7} />
            ))}
          </TBody>
        </Table>
      ) : !orders.data || orders.data.length === 0 ? (
        <EmptyState title="No incoming orders yet" description="Once customers place rentals for your gear, they'll appear here." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Order</TH>
              <TH>Customer</TH>
              <TH>Gear</TH>
              <TH>Dates</TH>
              <TH>Status</TH>
              <TH>Total</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {orders.data.map((o) => (
              <OrderRow key={o.id} order={o} onTransition={transition} busy={update.isPending} />
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}

function OrderRow({
  order,
  onTransition,
  busy,
}: {
  order: RentalOrder;
  onTransition: (id: string, status: RentalStatus) => void;
  busy: boolean;
}) {
  const item = order.items?.[0];
  const actions = NEXT_ACTIONS[order.status] ?? [];
  return (
    <TR>
      <TD>
        <div className="font-mono text-xs">{order.orderNumber}</div>
      </TD>
      <TD>
        <div className="text-sm">{order.customer?.name ?? "—"}</div>
        <div className="text-xs text-slate-500">{order.customer?.email ?? ""}</div>
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
        <div className="text-sm">{formatDate(order.rentalStartDate)} – {formatDate(order.rentalEndDate)}</div>
        <div className="text-xs text-slate-500">{daysBetween(order.rentalStartDate, order.rentalEndDate)} days</div>
      </TD>
      <TD>
        <RentalStatusBadge status={order.status} />
      </TD>
      <TD className="font-semibold">{formatCurrency(order.totalAmount)}</TD>
      <TD>
        <div className="flex flex-wrap gap-1">
          {actions.map((a) => (
            <Button
              key={a.to}
              size="sm"
              variant={a.variant ?? "default"}
              disabled={busy}
              onClick={() => onTransition(order.id, a.to)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </TD>
    </TR>
  );
}
