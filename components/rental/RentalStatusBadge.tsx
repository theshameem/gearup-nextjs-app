import { Badge } from "@/components/ui/badge";
import { RENTAL_STATUS_LABELS } from "@/lib/format";
import type { RentalStatus } from "@/lib/types";

const STATUS_STYLES: Record<RentalStatus, "amber" | "sky" | "violet" | "emerald" | "slate" | "rose"> = {
  PLACED: "amber",
  CONFIRMED: "sky",
  PAID: "violet",
  PICKED_UP: "emerald",
  RETURNED: "slate",
  CANCELLED: "rose",
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge tone={STATUS_STYLES[status]}>
      {RENTAL_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
