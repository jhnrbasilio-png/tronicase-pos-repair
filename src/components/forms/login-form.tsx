"use client";

import type * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid credentials. Try one of the demo accounts below.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-black/45 shadow-2xl">
      <CardHeader>
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-md bg-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Sign in to TroniCase</CardTitle>
        <CardDescription>Use role-based demo access. Password for all accounts is password123.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input name="email" type="email" defaultValue="super@tronicase.test" placeholder="Email" required />
          <Input name="password" type="password" defaultValue="password123" placeholder="Password" required />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <div className="mt-5 grid gap-2 text-xs text-muted-foreground">
          <p>super@tronicase.test - Super Admin</p>
          <p>cashier@tronicase.test - Sales Lady / Cashier</p>
          <p>tech@tronicase.test - Technician</p>
        </div>
      </CardContent>
    </Card>
  );
}
