"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const login = useLogin();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const data = await login.mutateAsync(values);
      const role = (data.user?.role ?? "").toLowerCase();
      const dashboard = role === "customer" || role === "provider" || role === "admin"
        ? `/dashboard/${role}`
        : "/";
      toast.success("Signed in");
      router.push(next || dashboard);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not sign in";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Mountain className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to continue your GearUp journey.</p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-rose-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-rose-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href={`/auth/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-emerald-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
