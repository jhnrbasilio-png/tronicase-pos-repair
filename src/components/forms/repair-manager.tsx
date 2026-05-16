"use client";

import type * as React from "react";
import { useState } from "react";
import { Camera, ClipboardSignature, Plus, UserRoundCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { branches, products, repairTickets as initialTickets, users } from "@/lib/sample-data";
import { money } from "@/lib/utils";

const statuses = ["Pending", "Diagnosing", "Waiting Parts", "In Progress", "Completed", "Released", "Cancelled"];
type Ticket = (typeof initialTickets)[number];

export function RepairManager() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  function createTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ticket: Ticket = {
      id: `r-${Date.now().toString().slice(-5)}`,
      customer: String(form.get("customer")),
      device: String(form.get("device")),
      problem: String(form.get("problem")),
      status: String(form.get("status")),
      technician: String(form.get("technician")),
      branch: String(form.get("branch")),
      laborFee: Number(form.get("laborFee")),
      partsTotal: Number(form.get("partsTotal")),
      warrantyUntil: String(form.get("warrantyUntil"))
    };
    setTickets((current) => [ticket, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card className="bg-black/25">
        <CardHeader>
          <CardTitle>Repair Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Ticket</TH>
                <TH>Customer / Device</TH>
                <TH>Technician</TH>
                <TH>Status</TH>
                <TH className="text-right">Total</TH>
              </TR>
            </THead>
            <TBody>
              {tickets.map((ticket) => (
                <TR key={ticket.id}>
                  <TD className="font-medium">{ticket.id.toUpperCase()}</TD>
                  <TD>
                    <p>{ticket.customer}</p>
                    <p className="text-xs text-muted-foreground">{ticket.device} - {ticket.problem}</p>
                  </TD>
                  <TD>{ticket.technician}</TD>
                  <TD><Badge variant={ticket.status === "Completed" || ticket.status === "Released" ? "success" : "default"}>{ticket.status}</Badge></TD>
                  <TD className="text-right">{money(ticket.laborFee + ticket.partsTotal)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-black/25">
        <CardHeader>
          <CardTitle>Create Repair Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={createTicket}>
            <Input name="customer" placeholder="Customer name" required />
            <Input name="device" placeholder="Device brand/model" required />
            <Textarea name="problem" placeholder="Problem description" required />
            <Textarea name="diagnosis" placeholder="Diagnosis notes" />
            <div className="grid grid-cols-2 gap-3">
              <Select name="technician">
                {users.filter((user) => user.role === "TECHNICIAN").map((user) => <option key={user.id}>{user.name}</option>)}
              </Select>
              <Select name="status">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </Select>
            </div>
            <Select name="branch">
              {branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}
            </Select>
            <Select name="parts">
              <option>Parts used</option>
              {products.map((product) => <option key={product.id}>{product.name}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input name="laborFee" type="number" min="0" placeholder="Labor fee" />
              <Input name="partsTotal" type="number" min="0" placeholder="Parts total" />
            </div>
            <Input name="warrantyUntil" type="date" />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-md border bg-input text-sm text-muted-foreground">
                <Camera className="h-4 w-4" />
                Before photo
                <input type="file" className="hidden" accept="image/*" />
              </label>
              <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-md border bg-input text-sm text-muted-foreground">
                <Camera className="h-4 w-4" />
                After photo
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <Textarea name="signature" placeholder="Customer signature text or encoded signature payload" />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" type="button"><ClipboardSignature className="h-4 w-4" />Signature</Button>
              <Button variant="secondary" type="button"><UserRoundCog className="h-4 w-4" />Assign Tech</Button>
            </div>
            <Button className="w-full"><Plus className="h-4 w-4" />Create Ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
