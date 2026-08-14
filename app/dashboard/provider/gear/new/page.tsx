import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { GearForm } from "@/components/provider/GearForm";

export const metadata = { title: "Add gear · Provider · GearUp" };

export default function NewGearPage() {
  return (
    <DashboardLayoutClient role="PROVIDER">
      <GearForm />
    </DashboardLayoutClient>
  );
}
