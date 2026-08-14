"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Store, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGearDetail } from "@/hooks/useGear";
import { RentDialog } from "@/components/rental/RentDialog";
import { formatCurrency, GEAR_CONDITION_LABELS, formatDate } from "@/lib/format";

export function GearDetailsClient({ id }: { id: string }) {
  const { data: gear, isLoading, error } = useGearDetail(id);
  const [rentOpen, setRentOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error || !gear) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="font-semibold">Couldn&apos;t load gear.</p>
        <p className="text-sm">{error?.message ?? "Gear not found."}</p>
        <Link href="/gear" className="mt-3 inline-block text-sm font-medium underline">
          Back to browse
        </Link>
      </div>
    );
  }

  const specs = (gear.specifications ?? {}) as Record<string, unknown>;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          {gear.imageUrl ? (
            <Image src={gear.imageUrl} alt={gear.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">No image</div>
          )}
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
            {gear.description || "No description provided."}
          </p>
        </section>

        {Object.keys(specs).length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
            <Card className="divide-y divide-slate-200 dark:divide-slate-800">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium">{String(v ?? "—")}</span>
                </div>
              ))}
            </Card>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
          {!gear.reviews || gear.reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {gear.reviews.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.user?.name ?? "Anonymous"}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
                  </div>
                  {r.comment ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p> : null}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
            <Tag className="h-3.5 w-3.5" />
            {gear.category?.name ?? "Gear"}
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{gear.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {gear.averageRating?.toFixed?.(1) ?? "—"}
              </span>
              <span>({gear.reviewCount ?? 0} reviews)</span>
            </div>
            <span>·</span>
            <span>{gear.brand ?? "—"}</span>
          </div>
        </div>

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold">
              {formatCurrency(gear.dailyRentalPrice)}
              <span className="text-sm font-normal text-slate-500">/day</span>
            </span>
            <Badge tone={gear.availableStock > 0 ? "emerald" : "rose"}>
              {gear.availableStock > 0 ? `${gear.availableStock} in stock` : "Out of stock"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Condition</p>
              <p className="font-medium">{GEAR_CONDITION_LABELS[gear.condition] ?? gear.condition}</p>
            </div>
            <div>
              <p className="text-slate-500">Deposit</p>
              <p className="font-medium">{formatCurrency(gear.depositAmount)}</p>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full"
            disabled={gear.availableStock <= 0}
            onClick={() => setRentOpen(true)}
          >
            <ShoppingBag className="h-4 w-4" />
            Rent now
          </Button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Store className="h-4 w-4" />
            Provided by
          </div>
          <p className="mt-1 font-semibold">{gear.provider?.name ?? "GearUp Partner"}</p>
        </Card>
      </aside>

      <RentDialog gear={gear} open={rentOpen} onClose={() => setRentOpen(false)} />
    </div>
  );
}
