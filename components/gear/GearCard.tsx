"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { GearItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GearCard({ item }: { item: GearItem }) {
  const inStock = item.availableStock > 0;
  return (
    <Link
      href={`/gear/${item.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        "dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone={inStock ? "emerald" : "rose"}>
            {inStock ? "Available" : "Out of stock"}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {item.category?.name ?? "Gear"}
            </p>
            <h3 className="line-clamp-1 text-base font-semibold">{item.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {item.averageRating?.toFixed?.(1) ?? "—"}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold">
            {formatCurrency(item.dailyRentalPrice)}
            <span className="text-xs font-normal text-slate-500">/day</span>
          </span>
          <span className="text-xs text-slate-500">{item.brand ?? ""}</span>
        </div>
      </div>
    </Link>
  );
}
