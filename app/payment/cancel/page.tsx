import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
        <XCircle className="h-9 w-9" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Payment cancelled</h1>
      <p className="mt-2 text-sm text-slate-500">
        No worries — your rental is still reserved. You can retry whenever you&apos;re ready.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/customer">Back to my rentals</Link>
      </Button>
    </div>
  );
}
