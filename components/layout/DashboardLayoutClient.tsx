"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Link from "next/link";
import { RoleSidebar } from "./RoleSidebar";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function DashboardLayoutClient({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== role) {
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [hydrated, user, role, router, pathname]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-7xl gap-0 px-0 md:gap-6 md:px-6 lg:px-8">
      <RoleSidebar role={role} />
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-0">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenMobile((v) => !v)}
          >
            <Menu className="mr-2 h-4 w-4" />
            Menu
          </Button>
          <Link href="/" className="text-sm text-slate-500">
            Back to site
          </Link>
        </div>
        {openMobile ? (
          <div className="mb-4 md:hidden">
            <RoleSidebar role={role} />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
