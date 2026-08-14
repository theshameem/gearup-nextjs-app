import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata = { title: "Users · Admin · GearUp" };

export default function AdminUsersPage() {
  return (
    <DashboardLayoutClient role="ADMIN">
      <AdminUsersClient />
    </DashboardLayoutClient>
  );
}
