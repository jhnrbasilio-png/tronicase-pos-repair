"use client";

import type * as React from "react";
import { useState } from "react";
import { ArrowRightLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { branches, products as initialProducts } from "@/lib/sample-data";
import { money } from "@/lib/utils";

type Product = (typeof initialProducts)[number];

const emptyProduct: Product = {
  id: "",
  name: "",
  sku: "",
  barcode: "",
  category: "Accessories",
  brand: "",
  compatibility: "",
  costPrice: 0,
  sellingPrice: 0,
  stock: 0,
  lowStock: 5
};

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [draft, setDraft] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      setProducts((current) => current.map((product) => (product.id === editingId ? { ...draft, id: editingId } : product)));
    } else {
      setProducts((current) => [{ ...draft, id: `p-${Date.now()}` }, ...current]);
    }
    setDraft(emptyProduct);
    setEditingId(null);
  }

  function edit(product: Product) {
    setDraft(product);
    setEditingId(product.id);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card className="bg-black/25">
        <CardHeader>
          <CardTitle>Products / Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Product</TH>
                <TH>SKU / Barcode</TH>
                <TH>Compatibility</TH>
                <TH className="text-right">Stock</TH>
                <TH className="text-right">Price</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {products.map((product) => (
                <TR key={product.id}>
                  <TD>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} - {product.brand}</p>
                  </TD>
                  <TD>
                    <p>{product.sku}</p>
                    <p className="text-xs text-muted-foreground">{product.barcode}</p>
                  </TD>
                  <TD>{product.compatibility}</TD>
                  <TD className="text-right">
                    <Badge variant={product.stock <= product.lowStock ? "danger" : "muted"}>{product.stock}</Badge>
                  </TD>
                  <TD className="text-right">{money(product.sellingPrice)}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => edit(product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setProducts((current) => current.filter((row) => row.id !== product.id))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <aside className="space-y-6">
        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Product" : "Add Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={saveProduct}>
              <Input placeholder="Product name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="SKU" value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} required />
                <Input placeholder="Barcode" value={draft.barcode} onChange={(event) => setDraft({ ...draft, barcode: event.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
                <Input placeholder="Brand" value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} />
              </div>
              <Input placeholder="Brand/model compatibility" value={draft.compatibility} onChange={(event) => setDraft({ ...draft, compatibility: event.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Cost" value={draft.costPrice} onChange={(event) => setDraft({ ...draft, costPrice: Number(event.target.value) })} />
                <Input type="number" placeholder="Selling" value={draft.sellingPrice} onChange={(event) => setDraft({ ...draft, sellingPrice: Number(event.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Stock" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} />
                <Input type="number" placeholder="Low-stock alert" value={draft.lowStock} onChange={(event) => setDraft({ ...draft, lowStock: Number(event.target.value) })} />
              </div>
              <Button className="w-full"><Plus className="h-4 w-4" />{editingId ? "Save Changes" : "Add Product"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-black/25">
          <CardHeader>
            <CardTitle>Stock Transfer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select><option>Select product</option>{products.map((product) => <option key={product.id}>{product.name}</option>)}</Select>
            <div className="grid grid-cols-2 gap-3">
              <Select>{branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}</Select>
              <Select>{branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}</Select>
            </div>
            <Input type="number" min="1" placeholder="Quantity" />
            <Button variant="secondary" className="w-full"><ArrowRightLeft className="h-4 w-4" />Create Transfer</Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
