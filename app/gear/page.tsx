import type { Metadata } from "next";
import { GearBrowseClient } from "@/components/gear/GearBrowseClient";

export const metadata: Metadata = {
  title: "Browse gear · GearUp",
  description: "Browse all available sports and outdoor gear on GearUp.",
};

export default function GearBrowsePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Browse gear</h1>
        <p className="text-slate-500">Find what you need for your next adventure.</p>
      </div>
      <GearBrowseClient />
    </div>
  );
}
