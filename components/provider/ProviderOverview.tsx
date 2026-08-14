"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { useProviderGearLocal, useDeleteGear } from "@/hooks/useProvider";
import { useProviderOrders } from "@/hooks/useProvider";
import { formatCurrency } from "@/lib/format";
import type { RentalStatus } from "@/lib/types";

const ACTIVE_STATUSES: RentalStatus[] = ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"];

export function ProviderOverview() {
  const gear = useProviderGearLocal();
  const orders = useProviderOrders();
  const deleteGear = useDeleteGear();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeOrders = useMemo(
    () => (orders.data ?? []).filter((o) => ACTIVE_STATUSES.includes(o.status)),
    [orders.data],
  );
  const pendingConfirmations = useMemo(
    () => (orders.data ?? []).filter((o) => o.status === "PLACED").length,
    [orders.data],
  );

  async function onDelete() {
    if (!confirmDeleteId) return;
    try {
      await deleteGear.mutateAsync(confirmDeleteId);
      toast.success("Gear removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Provider dashboard</h1>
          <p className="text-sm text-slate-500">Manage your inventory and incoming orders.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/provider/gear/new">
            <Plus className="h-4 w-4" /> Add gear
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Gear listed" value={String(gear.length)} />
        <Stat label="Active rentals" value={String(activeOrders.length)} />
        <Stat label="Pending confirmations" value={String(pendingConfirmations)} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My inventory</h2>
          <Link href="/dashboard/provider/orders" className="text-sm text-emerald-600 hover:underline">
            View orders →
          </Link>
        </div>

        {gear.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title="No gear added this session"
            description="The backend doesn't expose a provider-inventory listing endpoint yet. Anything you add below will be cached locally."
            cta={{ label: "Add gear", href: "/dashboard/provider/gear/new" }}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Category</TH>
                <TH>Price/day</TH>
                <TH>Stock</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {gear.map((g) => (
                <TR key={g.id}>
                  <TD>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-slate-500">{g.brand ?? "—"}</div>
                  </TD>
                  <TD>{g.category?.name ?? "—"}</TD>
                  <TD>{formatCurrency(g.dailyRentalPrice)}</TD>
                  <TD>
                    {g.availableStock}/{g.totalStock}
                  </TD>
                  <TD>
                    <span className={g.isActive ? "text-emerald-600" : "text-slate-400"}>
                      {g.isActive ? "Active" : "Disabled"}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/provider/gear/${g.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setConfirmDeleteId(g.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </section>

      {orders.isLoading ? (
        <Table>
          <THead>
            <TR>
              <TH>Order</TH>
              <TH>Gear</TH>
              <TH>Status</TH>
              <TH>Dates</TH>
            </TR>
          </THead>
          <TBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={4} />
            ))}
          </TBody>
        </Table>
      ) : null}

      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete this gear?"
        description="If active rentals exist, the backend will soft-disable instead of delete."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={deleteGear.isPending}>
            Delete
          </Button>
        </div>
      </Dialog>
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
