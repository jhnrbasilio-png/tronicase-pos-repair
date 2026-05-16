import { AppShell } from "@/components/layout/app-shell";
import { ReportsPanel } from "@/components/forms/reports-panel";

export default function ReportsPage() {
  return (
    <AppShell title="Sales Report">
      <ReportsPanel />
    </AppShell>
  );
}
