import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { PayPageClient } from "@/components/customer/PayPageClient";

export default async function PayOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayoutClient role="CUSTOMER">
      <PayPageClient orderId={id} />
    </DashboardLayoutClient>
  );
}
