import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { AdminRentalsClient } from "@/components/admin/AdminRentalsClient";

export const metadata = { title: "Rentals · Admin · GearUp" };

export default function AdminRentalsPage() {
  return (
    <DashboardLayoutClient role="ADMIN">
      <AdminRentalsClient />
    </DashboardLayoutClient>
  );
}
