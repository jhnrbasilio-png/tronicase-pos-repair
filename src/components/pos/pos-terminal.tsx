"use client";

import { useMemo, useState } from "react";
import { Download, Minus, Plus, Printer, ScanLine, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/sample-data";
import { money } from "@/lib/utils";

type CartItem = (typeof products)[number] & { quantity: number };

export function POSTerminal() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("CASH");
  const [amountTendered, setAmountTendered] = useState(0);

  const visibleProducts = products.filter((product) => {
    const text = `${product.name} ${product.sku} ${product.barcode}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0), [cart]);
  const total = Math.max(0, subtotal - discount);
  const change = payment === "CASH" ? Math.max(0, amountTendered - total) : 0;

  function addToCart(product: (typeof products)[number]) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function downloadReceipt() {
    const receipt = [
      "TRONICASE OFFICIAL RECEIPT",
      "Branch: TroniCase Main",
      `Payment: ${payment}`,
      "",
      ...cart.map((item) => `${item.quantity} x ${item.name} - ${money(item.quantity * item.sellingPrice)}`),
      "",
      `Subtotal: ${money(subtotal)}`,
      `Discount: ${money(discount)}`,
      `Total: ${money(total)}`,
      `Tendered: ${money(amountTendered)}`,
      `Change: ${money(change)}`
    ].join("\n");
    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tronicase-receipt-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="space-y-4">
        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Product Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, SKU, or barcode"
              />
              <ScanLine className="absolute right-3 top-2.5 h-5 w-5 text-red-300" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => addToCart(product)}
              className="rounded-lg border bg-card p-4 text-left transition hover:border-red-400 hover:bg-red-500/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <Badge variant={product.stock <= product.lowStock ? "danger" : "muted"}>{product.stock}</Badge>
              </div>
              <p className="mt-4 text-xl font-bold">{money(product.sellingPrice)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{product.compatibility}</p>
            </button>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? <p className="text-sm text-muted-foreground">Cart is ready for scanning.</p> : null}
            {cart.map((item) => (
              <div key={item.id} className="rounded-md border bg-black/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{money(item.sellingPrice)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setCart((current) => current.filter((row) => row.id !== item.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-md border">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-bold">{money(item.quantity * item.sellingPrice)}</p>
                </div>
              </div>
            ))}

            <div className="grid gap-3 border-t pt-4">
              <label className="text-sm text-muted-foreground">Discount</label>
              <Input type="number" min="0" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} />
              <label className="text-sm text-muted-foreground">Payment</label>
              <Select value={payment} onChange={(event) => setPayment(event.target.value)}>
                <option value="CASH">Cash</option>
                <option value="GCASH">GCash</option>
              </Select>
              <label className="text-sm text-muted-foreground">Amount tendered</label>
              <Input type="number" min="0" value={amountTendered} onChange={(event) => setAmountTendered(Number(event.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/25">
          <CardContent className="space-y-3 pt-5">
            <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Discount</span><span>{money(discount)}</span></div>
            <div className="flex justify-between text-2xl font-black"><span>Total</span><span>{money(total)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Change</span><span>{money(change)}</span></div>
            <Button className="w-full" disabled={!cart.length}>
              Complete Checkout
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => window.print()} disabled={!cart.length}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="secondary" onClick={downloadReceipt} disabled={!cart.length}>
                <Download className="h-4 w-4" />
                Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="printable-receipt receipt-print rounded p-4 text-xs">
          <p className="text-center text-base font-bold">TRONICASE</p>
          <p className="text-center">POS + Repair Receipt</p>
          <hr className="my-2 border-dashed border-black" />
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span>{item.quantity} x {item.name}</span>
              <span>{money(item.quantity * item.sellingPrice)}</span>
            </div>
          ))}
          <hr className="my-2 border-dashed border-black" />
          <div className="flex justify-between font-bold"><span>Total</span><span>{money(total)}</span></div>
          <p className="mt-3 text-center">Thank you for choosing TroniCase.</p>
        </div>
      </aside>
    </div>
  );
}
