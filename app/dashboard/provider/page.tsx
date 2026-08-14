import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { ProviderOverview } from "@/components/provider/ProviderOverview";

export const metadata = { title: "Provider · GearUp" };

export default function ProviderDashboardPage() {
  return (
    <DashboardLayoutClient role="PROVIDER">
      <ProviderOverview />
    </DashboardLayoutClient>
  );
}
