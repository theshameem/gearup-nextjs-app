import { GearCard } from "./GearCard";
import type { GearItem } from "@/lib/types";

export function GearGrid({ items, empty }: { items: GearItem[]; empty?: React.ReactNode }) {
  if (!items.length) return <>{empty}</>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <GearCard key={item.id} item={item} />
      ))}
    </div>
  );
}
