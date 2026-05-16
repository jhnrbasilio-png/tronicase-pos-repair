import { AppShell } from "@/components/layout/app-shell";
import { POSTerminal } from "@/components/pos/pos-terminal";

export default function POSPage() {
  return (
    <AppShell title="POS / Checkout">
      <POSTerminal />
    </AppShell>
  );
}
