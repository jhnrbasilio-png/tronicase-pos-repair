import { AppShell } from "@/components/layout/app-shell";
import { RepairManager } from "@/components/forms/repair-manager";

export default function RepairsPage() {
  return (
    <AppShell title="Repairs">
      <RepairManager />
    </AppShell>
  );
}
