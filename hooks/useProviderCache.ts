"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GearItem } from "@/lib/types";

export interface CachedGear extends GearItem {
  cachedAt: string;
}

interface ProviderGearCacheState {
  items: CachedGear[];
  add: (item: GearItem) => void;
  update: (id: string, patch: Partial<GearItem>) => void;
  remove: (id: string) => void;
  upsertMany: (items: GearItem[]) => void;
  clear: () => void;
}

export const useProviderGearCache = create<ProviderGearCacheState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: [
            { ...item, cachedAt: new Date().toISOString() },
            ...s.items.filter((i) => i.id !== item.id),
          ],
        })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, ...patch, cachedAt: new Date().toISOString() } : i,
          ),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      upsertMany: (items) =>
        set((s) => {
          const now = new Date().toISOString();
          const map = new Map(s.items.map((i) => [i.id, i]));
          for (const it of items) map.set(it.id, { ...it, cachedAt: now });
          return { items: Array.from(map.values()) };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "gearup:provider:gear",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useProviderGearLocal(): CachedGear[] {
  return useProviderGearCache((s) => s.items);
}
