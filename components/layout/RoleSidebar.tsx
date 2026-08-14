"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CalendarCheck2,
  Wrench,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: Record<UserRole, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer#orders", label: "My rentals", icon: ShoppingBag },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear/new", label: "Add gear", icon: Package },
    { href: "/dashboard/provider/orders", label: "Orders", icon: CalendarCheck2 },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear", icon: Package },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: Wrench },
  ],
};

export function RoleSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const items = NAV[role];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:block">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Dashboard</span>
          {user ? <RoleBadge role={user.role} /> : null}
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 hidden md:block">
        <LogoutButton className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800" />
      </div>
    </aside>
  );
}
