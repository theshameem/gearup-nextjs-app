"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  return (
    <button
      type="button"
      onClick={() => {
        logout();
        toast.success("Signed out");
        router.push("/");
      }}
      className={className ?? "inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300"}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
