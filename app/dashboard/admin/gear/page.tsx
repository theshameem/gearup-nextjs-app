import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { AdminGearClient } from "@/components/admin/AdminGearClient";

export const metadata = { title: "Gear · Admin · GearUp" };

export default function AdminGearPage() {
  return (
    <DashboardLayoutClient role="ADMIN">
      <AdminGearClient />
    </DashboardLayoutClient>
  );
}
