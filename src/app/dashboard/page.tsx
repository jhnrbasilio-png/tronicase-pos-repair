import { AlertTriangle, Banknote, Boxes, Calculator, Wrench } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { expenses, products, repairTickets } from "@/lib/sample-data";
import { money } from "@/lib/utils";

const metrics = [
  { label: "Today Sales", value: 73950, icon: Banknote, tone: "text-emerald-300" },
  { label: "Completed Repairs", value: 18, icon: Wrench, tone: "text-red-300" },
  { label: "Inventory Value", value: 482300, icon: Boxes, tone: "text-white" },
  { label: "Expenses", value: 27750, icon: Calculator, tone: "text-amber-300" },
  { label: "Net Income", value: 46200, icon: Banknote, tone: "text-emerald-300" }
];

export default function DashboardPage() {
  const lowStock = products.filter((product) => product.stock <= product.lowStock);

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="bg-black/25">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{metric.label}</CardDescription>
                <Icon className={`h-5 w-5 ${metric.tone}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{typeof metric.value === "number" && metric.value > 1000 ? money(metric.value) : metric.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Daily POS and repair revenue with monthly trend view.</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items needing replenishment by branch inventory rules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-md border bg-red-500/5 p-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <Badge variant="danger">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {product.stock} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Recent Repair Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Ticket</TH>
                  <TH>Customer</TH>
                  <TH>Device</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {repairTickets.map((ticket) => (
                  <TR key={ticket.id}>
                    <TD className="font-medium">{ticket.id.toUpperCase()}</TD>
                    <TD>{ticket.customer}</TD>
                    <TD>{ticket.device}</TD>
                    <TD><Badge variant={ticket.status === "Completed" ? "success" : "default"}>{ticket.status}</Badge></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Category</TH>
                  <TH>Branch</TH>
                  <TH className="text-right">Amount</TH>
                </TR>
              </THead>
              <TBody>
                {expenses.map((expense) => (
                  <TR key={expense.id}>
                    <TD>{expense.category}</TD>
                    <TD>{expense.branch}</TD>
                    <TD className="text-right font-medium">{money(expense.amount)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
