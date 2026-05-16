"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  value,
  onValueChange,
  items
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="inline-flex rounded-md border bg-muted p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onValueChange(item.value)}
          className={cn(
            "h-8 rounded px-3 text-sm text-muted-foreground transition",
            value === item.value && "bg-primary text-primary-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
