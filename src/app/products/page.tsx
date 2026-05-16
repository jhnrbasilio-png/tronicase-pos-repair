import { AppShell } from "@/components/layout/app-shell";
import { ProductManager } from "@/components/forms/product-manager";

export default function ProductsPage() {
  return (
    <AppShell title="Products / Inventory">
      <ProductManager />
    </AppShell>
  );
}
