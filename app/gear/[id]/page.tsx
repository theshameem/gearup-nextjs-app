import type { Metadata } from "next";
import { GearDetailsClient } from "@/components/gear/GearDetailsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Gear ${id} · GearUp` };
}

export default async function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <GearDetailsClient id={id} />
    </div>
  );
}
