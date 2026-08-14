"use client";

import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GearGrid } from "@/components/gear/GearGrid";
import { useCategories, useGearList } from "@/hooks/useGear";
import { SkeletonCard } from "@/components/shared/Skeleton";

export default function HomePage() {
  const categories = useCategories();
  const gear = useGearList({ availableOnly: true });

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Rent anything. Adventure everywhere.
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Sports &amp; outdoor gear, on demand.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Skip the closet of dusty equipment. Browse curated gear from local providers, pick your dates, and pay securely. We&apos;ll handle the rest.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/gear">
                  Browse gear
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/register">Become a provider</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Feature icon={<Search className="h-4 w-4" />} title="Discover" body="Filter by category, brand, price, and availability." />
              <Feature icon={<ShieldCheck className="h-4 w-4" />} title="Secure pay" body="Stripe-backed checkout for every rental." />
              <Feature icon={<Truck className="h-4 w-4" />} title="Pickup &amp; return" body="Coordinate with providers in a few clicks." />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-200 to-sky-200 opacity-50 blur-3xl dark:from-emerald-900 dark:to-sky-900" />
            <div className="relative grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-3xl bg-white/70 p-4 shadow-lg backdrop-blur dark:bg-slate-900/70"
                >
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <span className="text-xs">Featured gear #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Browse by category</h2>
            <p className="text-sm text-slate-500">Pick what you&apos;re into.</p>
          </div>
          <Link href="/categories" className="text-sm font-medium text-emerald-600 hover:underline">
            See all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="h-9 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              ))
            : categories.data?.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  href={`/gear?categoryId=${c.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
                >
                  {c.name}
                  {typeof c.activeGearItemCount === "number" ? (
                    <span className="text-xs text-slate-400">({c.activeGearItemCount})</span>
                  ) : null}
                </Link>
              ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured gear</h2>
            <p className="text-sm text-slate-500">Top picks ready to ship today.</p>
          </div>
          <Link href="/gear" className="text-sm font-medium text-emerald-600 hover:underline">
            View all
          </Link>
        </div>
        {gear.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <GearGrid items={gear.data?.items ?? []} />
        )}
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
        {icon}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-slate-500">{body}</div>
    </div>
  );
}
