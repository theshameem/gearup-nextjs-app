"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { RoleBadge, StatusBadge } from "@/components/shared/RoleBadge";
import { SkeletonTableRow } from "@/components/shared/Skeleton";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/format";

export function AdminUsersClient() {
  const users = useAdminUsers();
  const update = useUpdateAdminUser();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("");

  const filtered = useMemo(() => {
    return (users.data ?? []).filter((u) => {
      if (role && u.role !== role) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
      );
    });
  }, [users.data, q, role]);

  async function toggleStatus(id: string, current: string) {
    const next = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await update.mutateAsync({ id, payload: { status: next as "ACTIVE" | "SUSPENDED" } });
      toast.success(`User ${next === "ACTIVE" ? "activated" : "suspended"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-slate-500">Manage customers, providers, and admins.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="max-w-[160px]">
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PROVIDER">Provider</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH>Joined</TH>
            <TH>Actions</TH>
          </TR>
        </THead>
        <TBody>
          {users.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
          ) : filtered.length === 0 ? (
            <TR>
              <TD colSpan={6} className="py-8 text-center text-slate-500">
                No users match.
              </TD>
            </TR>
          ) : (
            filtered.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium">{u.name}</TD>
                <TD>{u.email}</TD>
                <TD><RoleBadge role={u.role} /></TD>
                <TD><StatusBadge status={u.status} /></TD>
                <TD className="text-xs text-slate-500">{formatDate(u.createdAt)}</TD>
                <TD>
                  <Button
                    size="sm"
                    variant={u.status === "ACTIVE" ? "destructive" : "default"}
                    onClick={() => toggleStatus(u.id, u.status)}
                    disabled={update.isPending}
                  >
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
