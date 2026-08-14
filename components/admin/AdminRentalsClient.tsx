"use client";

import Link from "next/link";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { useAdminRentals } from "@/hooks/useAdmin";
import { formatCurrency, formatDate, daysBetween } from "@/lib/format";

export function AdminRentalsClient() {
  const rentals = useAdminRentals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All rentals</h1>
        <p className="text-sm text-slate-500">Audit every rental across the platform.</p>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Order</TH>
            <TH>Customer</TH>
            <TH>Gear</TH>
            <TH>Dates</TH>
            <TH>Status</TH>
            <TH>Total</TH>
          </TR>
        </THead>
        <TBody>
          {rentals.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
          ) : !rentals.data || rentals.data.length === 0 ? (
            <TR>
              <TD colSpan={6} className="py-8 text-center text-slate-500">No rentals.</TD>
            </TR>
          ) : (
            rentals.data.map((r) => {
              const item = r.items?.[0];
              return (
                <TR key={r.id}>
                  <TD className="font-mono text-xs">{r.orderNumber}</TD>
                  <TD>{r.customer?.name ?? "—"}</TD>
                  <TD>
                    {item ? (
                      <Link href={`/gear/${item.gearItemId}`} className="font-medium hover:underline">
                        {item.gearItem?.name ?? "Gear"}
                      </Link>
                    ) : "—"}
                  </TD>
                  <TD>
                    <div className="text-sm">{formatDate(r.rentalStartDate)} – {formatDate(r.rentalEndDate)}</div>
                    <div className="text-xs text-slate-500">{daysBetween(r.rentalStartDate, r.rentalEndDate)} days</div>
                  </TD>
                  <TD><RentalStatusBadge status={r.status} /></TD>
                  <TD className="font-semibold">{formatCurrency(r.totalAmount)}</TD>
                </TR>
              );
            })
          )}
        </TBody>
      </Table>
    </div>
  );
}
