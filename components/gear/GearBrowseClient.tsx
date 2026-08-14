"use client";

import { useMemo, useState } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf, parseAsBoolean, parseAsInteger } from "nuqs";
import { Search, X } from "lucide-react";
import { Input, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useGear";
import { GearGrid } from "./GearGrid";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGearList } from "@/hooks/useGear";
import { cn } from "@/lib/utils";

export function GearBrowseClient() {
  const [filters, setFilters] = useQueryStates({
    searchTerm: parseAsString.withDefault(""),
    categoryId: parseAsArrayOf(parseAsString).withDefault([]),
    brand: parseAsString.withDefault(""),
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    availableOnly: parseAsBoolean.withDefault(true),
  });

  const [draftSearch, setDraftSearch] = useState(filters.searchTerm);

  const apiFilters = useMemo(
    () => ({
      searchTerm: filters.searchTerm || undefined,
      categoryId: filters.categoryId.length ? filters.categoryId : undefined,
      brand: filters.brand || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      availableOnly: filters.availableOnly,
    }),
    [filters],
  );

  const categories = useCategories();
  const gear = useGearList(apiFilters);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            placeholder="e.g. North Face"
            value={filters.brand}
            onChange={(e) => setFilters({ brand: e.target.value || null })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min">Min price</Label>
            <Input
              id="min"
              type="number"
              min={0}
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                setFilters({ minPrice: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
          <div>
            <Label htmlFor="max">Max price</Label>
            <Input
              id="max"
              type="number"
              min={0}
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                setFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
        </div>
        <div>
          <Label>Categories</Label>
          <div className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
            {categories.data?.map((c) => {
              const checked = filters.categoryId.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                    checked && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                  )}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? filters.categoryId.filter((id) => id !== c.id)
                        : [...filters.categoryId, c.id];
                      setFilters({ categoryId: next.length ? next : null });
                    }}
                  />
                  {c.name}
                </label>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-emerald-600"
            checked={filters.availableOnly}
            onChange={(e) => setFilters({ availableOnly: e.target.checked })}
          />
          Available only
        </label>
        {(filters.brand || filters.minPrice || filters.maxPrice || filters.categoryId.length) ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                brand: null,
                minPrice: null,
                maxPrice: null,
                categoryId: null,
              })
            }
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        ) : null}
      </aside>

      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({ searchTerm: draftSearch || null });
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search gear by name…"
            className="pl-9"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />
        </form>

        {gear.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (gear.data?.items ?? []).length === 0 ? (
          <EmptyState
            title="No gear matches your filters"
            description="Try clearing some filters or browsing all gear."
          />
        ) : (
          <GearGrid items={gear.data?.items ?? []} />
        )}
      </div>
    </div>
  );
}
