"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mountain, User, Store, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { useRegister, useLogin } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const registerM = useRegister();
  const loginM = useLogin();
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", phone: "", address: "", profileImage: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await registerM.mutateAsync({ ...values, role });
      const data = await loginM.mutateAsync({ email: values.email, password: values.password });
      const userRole = (data.user?.role ?? role).toLowerCase();
      toast.success("Account created");
      router.push(next || `/dashboard/${userRole}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create account";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Mountain className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-500">Pick how you want to use GearUp.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RoleCard
          active={role === "CUSTOMER"}
          onClick={() => setRole("CUSTOMER")}
          icon={<User className="h-5 w-5" />}
          title="Customer"
          description="Browse and rent gear for your next adventure."
        />
        <RoleCard
          active={role === "PROVIDER"}
          onClick={() => setRole("PROVIDER")}
          icon={<Store className="h-5 w-5" />}
          title="Provider"
          description="List your gear and fulfil rental orders."
        />
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-rose-600">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-xs text-rose-600">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
            {form.formState.errors.password ? (
              <p className="text-xs text-rose-600">{form.formState.errors.password.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" autoComplete="tel" {...form.register("phone")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input id="address" autoComplete="street-address" {...form.register("address")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="profileImage">Profile image URL (optional)</Label>
            <Input id="profileImage" type="url" placeholder="https://…" {...form.register("profileImage")} />
            {form.formState.errors.profileImage ? (
              <p className="text-xs text-rose-600">{form.formState.errors.profileImage.message}</p>
            ) : null}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href={`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          active
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
    </button>
  );
}
