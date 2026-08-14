"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks/usePayments";
import { Card } from "@/components/ui/card";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const confirm = useConfirmPayment();
  const [status, setStatus] = useState<"idle" | "confirming" | "pending" | "done" | "error">(
    sessionId ? "idle" : "error",
  );
  const [message, setMessage] = useState<string>(sessionId ? "" : "Missing session id");

  useEffect(() => {
    if (!sessionId) return;
    let attempts = 0;
    const tryConfirm = async () => {
      setStatus("confirming");
      try {
        await confirm.mutateAsync(sessionId);
        setStatus("done");
      } catch (err) {
        attempts += 1;
        if (attempts >= 5) {
          setStatus("pending");
          setMessage(err instanceof Error ? err.message : "Still finalizing");
        } else {
          setTimeout(tryConfirm, 1500);
        }
      }
    };
    tryConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Payment successful</h1>
      <p className="mt-2 text-sm text-slate-500">
        Thanks for renting with GearUp! We&apos;ve recorded your payment.
      </p>

      <Card className="mt-6 w-full p-4 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="font-medium">
            {status === "done"
              ? "Confirmed"
              : status === "pending"
                ? "Finalizing"
                : status === "error"
                  ? "Error"
                  : "Confirming…"}
          </span>
        </div>
        {message ? <p className="mt-2 text-xs text-slate-500">{message}</p> : null}
      </Card>

      <Button asChild className="mt-6">
        <Link href="/dashboard/customer">View my rentals</Link>
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading…</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
