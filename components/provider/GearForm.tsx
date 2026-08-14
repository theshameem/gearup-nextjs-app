"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import { useAddGear, useUpdateGear } from "@/hooks/useProvider";
import { useCategories } from "@/hooks/useGear";
import { useProviderGearLocal } from "@/hooks/useProviderCache";
import { GEAR_CONDITION_LABELS } from "@/lib/format";
import type { GearCondition, GearItem } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  description: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  dailyRentalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use a decimal like 9.99"),
  depositAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use a decimal like 50.00"),
  totalStock: z.coerce.number().int().min(1, "At least 1"),
  availableStock: z.coerce.number().int().min(0),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "FAIR"]),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Pick a category"),
  isActive: z.boolean(),
  specKeys: z.array(z.string()),
  specValues: z.array(z.string()),
});
type FormValues = z.infer<typeof schema>;

const EMPTY: Partial<GearItem> = {
  name: "",
  description: "",
  brand: "",
  model: "",
  dailyRentalPrice: "0.00",
  depositAmount: "0.00",
  totalStock: 1,
  availableStock: 1,
  condition: "NEW",
  imageUrl: "",
  isActive: true,
};

export function GearForm({ initial }: { initial?: Partial<GearItem> }) {
  const router = useRouter();
  const categories = useCategories();
  const addGear = useAddGear();
  const updateGear = useUpdateGear();
  const localItems = useProviderGearLocal();
  const isEdit = !!initial?.id;
  const [submitting, setSubmitting] = useState(false);

  const specsFromInit = initial?.specifications
    ? Object.entries(initial.specifications).map(([k, v]) => [k, String(v ?? "")] as [string, string])
    : [];

  const form = useForm<FormValues>({
    // z.coerce makes input/output diverge; cast resolver to satisfy RHF generics.
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: initial?.name ?? EMPTY.name ?? "",
      description: initial?.description ?? "",
      brand: initial?.brand ?? "",
      model: initial?.model ?? "",
      dailyRentalPrice: initial?.dailyRentalPrice ?? "0.00",
      depositAmount: initial?.depositAmount ?? "0.00",
      totalStock: initial?.totalStock ?? 1,
      availableStock: initial?.availableStock ?? 1,
      condition: (initial?.condition as GearCondition) ?? "NEW",
      imageUrl: initial?.imageUrl ?? "",
      categoryId: initial?.categoryId ?? "",
      isActive: initial?.isActive ?? true,
      specKeys: specsFromInit.map(([k]) => k),
      specValues: specsFromInit.map(([, v]) => v),
    },
  });

  useEffect(() => {
    if (!form.getValues("categoryId") && categories.data?.[0]) {
      form.setValue("categoryId", categories.data[0].id);
    }
  }, [categories.data, form]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const specifications: Record<string, string> = {};
    values.specKeys.forEach((k, i) => {
      if (k) specifications[k] = values.specValues[i] ?? "";
    });
    const payload = {
      name: values.name,
      description: values.description || undefined,
      brand: values.brand || undefined,
      model: values.model || undefined,
      dailyRentalPrice: values.dailyRentalPrice,
      depositAmount: values.depositAmount,
      totalStock: values.totalStock,
      availableStock: Math.min(values.availableStock, values.totalStock),
      condition: values.condition,
      imageUrl: values.imageUrl || undefined,
      categoryId: values.categoryId,
      isActive: values.isActive,
      specifications: Object.keys(specifications).length ? specifications : undefined,
    };
    try {
      if (isEdit && initial?.id) {
        await updateGear.mutateAsync({ id: initial.id, payload });
        toast.success("Gear updated");
      } else {
        await addGear.mutateAsync(payload as never);
        toast.success("Gear added");
      }
      router.push("/dashboard/provider");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save gear");
    } finally {
      setSubmitting(false);
    }
  }

  const specKeys = form.watch("specKeys") ?? [];
  const specValues = form.watch("specValues") ?? [];

  return (
      <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? "Edit gear" : "Add new gear"}
        </h1>
        <p className="text-sm text-slate-500">List a piece of gear for rent.</p>
      </div>

      <Section title="Basics">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Description">
          <Textarea rows={3} {...form.register("description")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand"><Input {...form.register("brand")} /></Field>
          <Field label="Model"><Input {...form.register("model")} /></Field>
        </div>
      </Section>

      <Section title="Pricing & stock">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Price/day" error={form.formState.errors.dailyRentalPrice?.message}>
            <Input {...form.register("dailyRentalPrice")} placeholder="9.99" />
          </Field>
          <Field label="Deposit" error={form.formState.errors.depositAmount?.message}>
            <Input {...form.register("depositAmount")} placeholder="50.00" />
          </Field>
          <Field label="Total stock" error={form.formState.errors.totalStock?.message}>
            <Input type="number" min={1} {...form.register("totalStock")} />
          </Field>
          <Field label="Available stock" error={form.formState.errors.availableStock?.message}>
            <Input type="number" min={0} {...form.register("availableStock")} />
          </Field>
        </div>
      </Section>

      <Section title="Condition & category">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Condition">
            <Select {...form.register("condition")}>
              {(Object.keys(GEAR_CONDITION_LABELS) as GearCondition[]).map((k) => (
                <option key={k} value={k}>{GEAR_CONDITION_LABELS[k]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Category" error={form.formState.errors.categoryId?.message}>
            <Select {...form.register("categoryId")}>
              <option value="">Pick…</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Media">
        <Field label="Image URL" error={form.formState.errors.imageUrl?.message}>
          <Input {...form.register("imageUrl")} placeholder="https://…" />
        </Field>
        {form.watch("imageUrl") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.watch("imageUrl")}
            alt="preview"
            className="mt-3 h-32 w-32 rounded-xl object-cover"
          />
        ) : null}
      </Section>

      <Section title="Specifications">
        <div className="space-y-2">
          {specKeys.map((_, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Key"
                value={specKeys[i] ?? ""}
                onChange={(e) => {
                  const next = [...specKeys];
                  next[i] = e.target.value;
                  form.setValue("specKeys", next);
                }}
              />
              <Input
                placeholder="Value"
                value={specValues[i] ?? ""}
                onChange={(e) => {
                  const next = [...specValues];
                  next[i] = e.target.value;
                  form.setValue("specValues", next);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  form.setValue("specKeys", specKeys.filter((_, j) => j !== i));
                  form.setValue("specValues", specValues.filter((_, j) => j !== i));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue("specKeys", [...specKeys, ""]);
              form.setValue("specValues", [...specValues, ""]);
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add spec
          </Button>
        </div>
      </Section>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-emerald-600" {...form.register("isActive")} />
        Active (visible to customers)
      </label>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create gear"}
        </Button>
      </div>

      {isEdit && !localItems.find((g: { id: string }) => g.id === initial?.id) ? (
        <p className="text-xs text-amber-600">
          This gear isn&apos;t in your local cache (probably created in a previous session). Saving will repopulate it.
        </p>
      ) : null}
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
