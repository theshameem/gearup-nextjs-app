import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { EditGearClient } from "@/components/provider/EditGearClient";

export const metadata = { title: "Edit gear · Provider · GearUp" };

export default async function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayoutClient role="PROVIDER">
      <EditGearClient id={id} />
    </DashboardLayoutClient>
  );
}
