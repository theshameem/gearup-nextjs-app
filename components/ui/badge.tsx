"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "amber" | "sky" | "violet" | "emerald" | "rose" | "slate";

const toneClasses: Record<Tone, string> = {
  default:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-200",
  amber:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300 dark:bg-amber-900/30 dark:text-amber-200",
  sky: "bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-300 dark:bg-sky-900/30 dark:text-sky-200",
  violet:
    "bg-violet-100 text-violet-800 ring-1 ring-inset ring-violet-300 dark:bg-violet-900/30 dark:text-violet-200",
  emerald:
    "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200",
  rose: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-300 dark:bg-rose-900/30 dark:text-rose-200",
  slate:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-800 dark:text-slate-200",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
