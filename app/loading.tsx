import { Mountain } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
        <Mountain className="h-6 w-6 animate-pulse" />
      </div>
      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full w-1/3 animate-pulse bg-emerald-500" />
      </div>
    </div>
  );
}
