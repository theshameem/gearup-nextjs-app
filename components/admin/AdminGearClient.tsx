"use client";

import Link from "next/link";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { useAdminGear } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/format";

export function AdminGearClient() {
  const gear = useAdminGear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All gear</h1>
        <p className="text-sm text-slate-500">Moderate listings across the platform.</p>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Category</TH>
            <TH>Provider</TH>
            <TH>Price/day</TH>
            <TH>Stock</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {gear.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
          ) : !gear.data || gear.data.length === 0 ? (
            <TR>
              <TD colSpan={6} className="py-8 text-center text-slate-500">No gear.</TD>
            </TR>
          ) : (
            gear.data.map((g) => (
              <TR key={g.id}>
                <TD>
                  <Link href={`/gear/${g.id}`} className="font-medium hover:underline">
                    {g.name}
                  </Link>
                </TD>
                <TD>{g.category?.name ?? "—"}</TD>
                <TD>{g.provider?.name ?? "—"}</TD>
                <TD>{formatCurrency(g.dailyRentalPrice)}</TD>
                <TD>{g.availableStock}/{g.totalStock}</TD>
                <TD>
                  <Badge tone={g.isActive ? "emerald" : "rose"}>
                    {g.isActive ? "Active" : "Disabled"}
                  </Badge>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
