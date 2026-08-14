"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useAdminGear, useAdminRentals, useAdminUsers } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/shared/Skeleton";

export function AdminOverview() {
  const users = useAdminUsers();
  const gear = useAdminGear();
  const rentals = useAdminRentals();

  const totalCustomers = users.data?.filter((u) => u.role === "CUSTOMER").length ?? 0;
  const totalProviders = users.data?.filter((u) => u.role === "PROVIDER").length ?? 0;
  const activeGear = gear.data?.filter((g) => g.isActive).length ?? 0;
  const totalRentals = rentals.data?.length ?? 0;
  const revenue = rentals.data?.reduce((sum, r) => sum + Number(r.totalAmount ?? 0), 0) ?? 0;

  const byMonth = useMemo(() => {
    const map = new Map<string, { month: string; rentals: number; revenue: number }>();
    rentals.data?.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const existing = map.get(key) ?? { month: key, rentals: 0, revenue: 0 };
      existing.rentals += 1;
      existing.revenue += Number(r.totalAmount ?? 0);
      map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [rentals.data]);

  const topCategories = useMemo(() => {
    const map = new Map<string, number>();
    rentals.data?.forEach((r) => {
      r.items?.forEach((it) => {
        map.set(it.gearItem?.name ?? "Other", (map.get(it.gearItem?.name ?? "Other") ?? 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [rentals.data]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
        <p className="text-sm text-slate-500">Platform metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Stat label="Customers" value={String(totalCustomers)} loading={users.isLoading} />
        <Stat label="Providers" value={String(totalProviders)} loading={users.isLoading} />
        <Stat label="Active gear" value={String(activeGear)} loading={gear.isLoading} />
        <Stat label="Total rentals" value={String(totalRentals)} loading={rentals.isLoading} />
        <Stat label="Revenue" value={formatCurrency(revenue)} loading={rentals.isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Rentals over time</h3>
          <div className="h-64">
            {rentals.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rentals" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Revenue by month</h3>
          <div className="h-64">
            {rentals.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold">Top rented gear</h3>
        <div className="h-64">
          {rentals.isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="name" type="category" fontSize={12} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      {loading ? <Skeleton className="mt-2 h-7 w-20" /> : <div className="mt-1 text-2xl font-semibold">{value}</div>}
    </div>
  );
}
