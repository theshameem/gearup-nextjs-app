"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Mountain, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { ProfileMenu } from "@/components/layout/ProfileMenu";

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const nextParam = searchParams.get("next") ?? "";
  const dashboardHref = user ? `/dashboard/${user.role.toLowerCase()}` : "/auth/login";

  const links = [
    { href: "/", label: "Home" },
    { href: "/gear", label: "Browse gear" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent backdrop-blur transition-colors",
        scrolled ? "border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Mountain className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">GearUp</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <ProfileMenu />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/auth/login${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`}>
                  Sign in
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/auth/register${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`}>
                  Get started
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                    {(user.name || "U").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                <Link
                  href={dashboardHref}
                  onClick={() => router.push(dashboardHref)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <LogoutButton className="inline-flex items-center gap-2 text-sm font-medium text-rose-600" />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
