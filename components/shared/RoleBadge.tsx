import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/format";
import type { UserRole, UserStatus } from "@/lib/types";

export function RoleBadge({ role }: { role: UserRole }) {
  const tone =
    role === "ADMIN"
      ? "rose"
      : role === "PROVIDER"
        ? "violet"
        : "emerald";
  return <Badge tone={tone}>{ROLE_LABELS[role] ?? role}</Badge>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge tone={status === "ACTIVE" ? "emerald" : "rose"}>
      {status === "ACTIVE" ? "Active" : "Suspended"}
    </Badge>
  );
}
