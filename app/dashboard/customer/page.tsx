import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { CustomerOverview } from "@/components/customer/CustomerOverview";

export const metadata = { title: "Customer · GearUp" };

export default function CustomerDashboardPage() {
  return (
    <DashboardLayoutClient role="CUSTOMER">
      <CustomerOverview />
    </DashboardLayoutClient>
  );
}
