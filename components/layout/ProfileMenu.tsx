"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { ROLE_LABELS } from "@/lib/format";

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  const dashboardHref = `/dashboard/${user.role.toLowerCase()}`;

  function handleSignOut() {
    logout();
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </span>
          <span className="hidden sm:inline">{user.name.split(/\s+/)[0]}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[220px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href={dashboardHref}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 dark:text-slate-200 dark:data-[highlighted]:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href={`${dashboardHref}/profile`}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 dark:text-slate-200 dark:data-[highlighted]:bg-slate-800"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />

          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-rose-600 outline-none transition-colors data-[highlighted]:bg-rose-50 dark:text-rose-400 dark:data-[highlighted]:bg-rose-950/40"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}