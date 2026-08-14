import Link from "next/link";
import { Mountain } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Mountain className="h-4 w-4" />
            </span>
            <span>GearUp</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Rent sports &amp; outdoor gear from trusted providers. Pay securely with Stripe.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/gear">Browse gear</Link></li>
            <li><Link href="/categories">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/auth/login">Sign in</Link></li>
            <li><Link href="/auth/register">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/dashboard/customer">Customer dashboard</Link></li>
            <li><Link href="/dashboard/provider">Provider dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        &copy; {new Date().getFullYear()} GearUp. All rights reserved.
      </div>
    </footer>
  );
}
