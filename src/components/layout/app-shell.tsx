"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Settings2,
  Wrench
} from "lucide-react";
import { branches } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "POS", icon: CreditCard },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/repairs", label: "Repairs", icon: Wrench },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/branches", label: "Branches", icon: Building2 }
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-black/30 backdrop-blur lg:block">
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-lg font-black text-white">TC</div>
          <div>
            <p className="text-lg font-bold">TroniCase</p>
            <p className="text-xs text-muted-foreground">POS + Repair Suite</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-white",
                  active && "bg-primary text-primary-foreground shadow-glow hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur lg:h-20 lg:px-8">
          <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.24em] text-red-300">TroniCase Command Center</p>
            <h1 className="truncate text-xl font-bold lg:text-2xl">{title}</h1>
          </div>
          <Select className="hidden max-w-xs md:block" defaultValue="all">
            <option value="all">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Logout" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
