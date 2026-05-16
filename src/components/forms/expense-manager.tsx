"use client";

import type * as React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { branches, expenses as initialExpenses, users } from "@/lib/sample-data";
import { money, shortDate } from "@/lib/utils";

type Expense = (typeof initialExpenses)[number] & { notes?: string };

export function ExpenseManager() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  function addExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setExpenses((current) => [
      {
        id: `e-${Date.now()}`,
        category: String(form.get("category")),
        branch: String(form.get("branch")),
        amount: Number(form.get("amount")),
        recordedBy: String(form.get("recordedBy")),
        date: String(form.get("date")),
        notes: String(form.get("notes") || "")
      },
      ...current
    ]);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card className="bg-black/25">
        <CardHeader><CardTitle>Shop Expenses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR><TH>Date</TH><TH>Category</TH><TH>Branch</TH><TH>Recorded By</TH><TH className="text-right">Amount</TH><TH></TH></TR>
            </THead>
            <TBody>
              {expenses.map((expense) => (
                <TR key={expense.id}>
                  <TD>{shortDate(expense.date)}</TD>
                  <TD>{expense.category}</TD>
                  <TD>{expense.branch}</TD>
                  <TD>{expense.recordedBy}</TD>
                  <TD className="text-right font-medium">{money(expense.amount)}</TD>
                  <TD className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setExpenses((current) => current.filter((row) => row.id !== expense.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-black/25">
        <CardHeader><CardTitle>Add Expense</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={addExpense}>
            <Input name="category" placeholder="Category" required />
            <Input name="amount" type="number" min="0" placeholder="Amount" required />
            <Select name="branch">{branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}</Select>
            <Select name="recordedBy">{users.map((user) => <option key={user.id}>{user.name}</option>)}</Select>
            <Input name="date" type="date" required />
            <Textarea name="notes" placeholder="Notes" />
            <Button className="w-full"><Plus className="h-4 w-4" />Record Expense</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
