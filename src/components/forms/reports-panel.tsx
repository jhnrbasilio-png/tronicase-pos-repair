"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { branches, salesTrend, users } from "@/lib/sample-data";
import { money } from "@/lib/utils";

export function ReportsPanel() {
  const totalPos = salesTrend.reduce((sum, row) => sum + row.pos, 0);
  const totalRepairs = salesTrend.reduce((sum, row) => sum + row.repairs, 0);

  function exportCsv() {
    const rows = ["day,pos_sales,repair_sales,total", ...salesTrend.map((row) => `${row.label},${row.pos},${row.repairs},${row.pos + row.repairs}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tronicase-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/25">
        <CardContent className="grid gap-3 pt-5 md:grid-cols-5">
          <Input type="date" />
          <Input type="date" />
          <Select><option>All branches</option>{branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}</Select>
          <Select><option>All cashiers</option>{users.filter((user) => user.role === "CASHIER").map((user) => <option key={user.id}>{user.name}</option>)}</Select>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" />CSV</Button>
            <Button variant="secondary" onClick={() => window.print()}><FileText className="h-4 w-4" />PDF</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/25"><CardHeader><CardTitle>POS Sales</CardTitle></CardHeader><CardContent><p className="text-3xl font-black">{money(totalPos)}</p></CardContent></Card>
        <Card className="bg-black/25"><CardHeader><CardTitle>Repair Sales</CardTitle></CardHeader><CardContent><p className="text-3xl font-black">{money(totalRepairs)}</p></CardContent></Card>
        <Card className="bg-black/25"><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-black">{money(totalPos + totalRepairs)}</p></CardContent></Card>
      </div>

      <Card className="bg-black/25">
        <CardHeader><CardTitle>Sales Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead><TR><TH>Day</TH><TH className="text-right">POS Sales</TH><TH className="text-right">Repair Sales</TH><TH className="text-right">Total</TH></TR></THead>
            <TBody>
              {salesTrend.map((row) => (
                <TR key={row.label}>
                  <TD>{row.label}</TD>
                  <TD className="text-right">{money(row.pos)}</TD>
                  <TD className="text-right">{money(row.repairs)}</TD>
                  <TD className="text-right font-medium">{money(row.pos + row.repairs)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
