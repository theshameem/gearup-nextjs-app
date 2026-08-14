import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata = { title: "Admin · GearUp" };

export default function AdminDashboardPage() {
  return (
    <DashboardLayoutClient role="ADMIN">
      <AdminOverview />
    </DashboardLayoutClient>
  );
}
