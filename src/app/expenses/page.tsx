import { AppShell } from "@/components/layout/app-shell";
import { ExpenseManager } from "@/components/forms/expense-manager";

export default function ExpensesPage() {
  return (
    <AppShell title="Expenses">
      <ExpenseManager />
    </AppShell>
  );
}
