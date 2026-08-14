"use client";

import { GearForm } from "@/components/provider/GearForm";
import { useProviderGearLocal } from "@/hooks/useProviderCache";

export function EditGearClient({ id }: { id: string }) {
  const items = useProviderGearLocal();
  const initial = items.find((g: { id: string }) => g.id === id);
  if (!initial) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
        <p className="font-semibold">Gear not found in local cache.</p>
        <p className="text-sm">We only show gear you&apos;ve added or edited in this browser.</p>
      </div>
    );
  }
  return <GearForm initial={initial} />;
}
