import type { Metadata } from "next";
import { GearGrid } from "@/components/gear/GearGrid";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { API_BASE } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Category, GearItem, ApiEnvelope, ListResponse } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = { title: "Categories · GearUp" };

async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!json.success) throw new Error(json.message ?? "Request failed");
  return json.data;
}

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let gear: GearItem[] = [];
  let error: string | null = null;

  try {
    const [catRes, gearRes] = await Promise.all([
      fetchPublic<ListResponse<Category>>(ENDPOINTS.categories),
      fetchPublic<ListResponse<GearItem>>(ENDPOINTS.gearList),
    ]);
    categories = catRes.result;
    gear = gearRes.result;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mb-8 text-slate-500">Jump into a category to discover gear.</p>

      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/gear?categoryId=${c.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900"
          >
            {c.name}
            {typeof c.activeGearItemCount === "number" ? (
              <span className="text-xs text-slate-400">({c.activeGearItemCount})</span>
            ) : null}
          </Link>
        ))}
      </div>

      {!gear.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <GearGrid items={gear} />
      )}
    </div>
  );
}
