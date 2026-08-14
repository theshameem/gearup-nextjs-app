"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateRental } from "@/hooks/useRentals";
import { useAuthStore } from "@/lib/auth-store";
import { formatCurrency } from "@/lib/format";
import type { GearItem } from "@/lib/types";

const schema = z
  .object({
    quantity: z.coerce.number().int().min(1, "At least 1").max(99),
    rentalStartDate: z.string().min(1, "Pick a start date"),
    rentalEndDate: z.string().min(1, "Pick an end date"),
    pickupAddress: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.rentalEndDate) > new Date(data.rentalStartDate), {
    message: "End date must be after start date",
    path: ["rentalEndDate"],
  });

type FormValues = z.infer<typeof schema>;

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function daysBetween(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function RentDialog({
  gear,
  open,
  onClose,
}: {
  gear: GearItem;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const create = useCreateRental();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      quantity: 1,
      rentalStartDate: today(),
      rentalEndDate: today(),
      pickupAddress: "",
      notes: "",
    },
  });

  const start = form.watch("rentalStartDate");
  const end = form.watch("rentalEndDate");
  const qty = form.watch("quantity");
  const days = useMemo(() => (start && end ? daysBetween(start, end) : 1), [start, end]);
  const subtotal = useMemo(() => Number(gear.dailyRentalPrice) * days * Math.max(1, qty || 1), [gear.dailyRentalPrice, days, qty]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await create.mutateAsync({
        gearItemId: gear.id,
        quantity: values.quantity,
        rentalStartDate: new Date(values.rentalStartDate).toISOString(),
        rentalEndDate: new Date(values.rentalEndDate).toISOString(),
        pickupAddress: values.pickupAddress || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Rental placed! Awaiting provider confirmation.");
      onClose();
      router.push("/dashboard/customer");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not place rental";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Rent ${gear.name}`}>
      {!user ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">You need to sign in to rent gear.</p>
          <Button onClick={() => router.push(`/auth/login?next=/gear/${gear.id}`)}>Sign in to rent</Button>
        </div>
      ) : user.role !== "CUSTOMER" ? (
        <p className="text-sm text-slate-500">Only customers can place rentals. Switch accounts to continue.</p>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={gear.availableStock}
                {...form.register("quantity")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Days</Label>
              <Input value={days} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start">Start date</Label>
              <Input id="start" type="date" min={today()} {...form.register("rentalStartDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">End date</Label>
              <Input id="end" type="date" min={start || today()} {...form.register("rentalEndDate")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pickup">Pickup address (optional)</Label>
            <Input id="pickup" {...form.register("pickupAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={3} {...form.register("notes")} />
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{formatCurrency(gear.dailyRentalPrice)}/day × {days} day{days > 1 ? "s" : ""} × {qty}</span>
              <span>Deposit {formatCurrency(gear.depositAmount)}</span>
            </div>
          </div>

          {Object.values(form.formState.errors).length > 0 ? (
            <ul className="text-xs text-rose-600">
              {Object.entries(form.formState.errors).map(([k, v]) => (
                <li key={k}>{v?.message as string}</li>
              ))}
            </ul>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Placing…" : "Place rental"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
