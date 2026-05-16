"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs } from "@/components/ui/tabs";
import { monthlySales, salesTrend } from "@/lib/sample-data";
import { money } from "@/lib/utils";
import { useState } from "react";

export function SalesChart() {
  const [mode, setMode] = useState("daily");
  const data = mode === "daily" ? salesTrend : monthlySales;

  return (
    <div className="space-y-4">
      <Tabs
        value={mode}
        onValueChange={setMode}
        items={[
          { value: "daily", label: "Daily" },
          { value: "monthly", label: "Monthly" }
        ]}
      />
      <div className="h-80">
        {mode === "daily" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `₱${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => money(Number(value))} contentStyle={{ background: "#090b11", border: "1px solid #272b36" }} />
              <Bar dataKey="pos" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Bar dataKey="repairs" fill="#ffffff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `₱${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => money(Number(value))} contentStyle={{ background: "#090b11", border: "1px solid #272b36" }} />
              <Line type="monotone" dataKey="sales" stroke="#e11d48" strokeWidth={3} dot={{ fill: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
