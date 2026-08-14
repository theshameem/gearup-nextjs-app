import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { ProviderOrdersClient } from "@/components/provider/ProviderOrdersClient";

export const metadata = { title: "Orders · Provider · GearUp" };

export default function ProviderOrdersPage() {
  return (
    <DashboardLayoutClient role="PROVIDER">
      <ProviderOrdersClient />
    </DashboardLayoutClient>
  );
}
