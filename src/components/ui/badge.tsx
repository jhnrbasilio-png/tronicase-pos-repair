import type * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "muted" | "danger" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-primary/15 text-red-200",
        variant === "muted" && "bg-white/10 text-muted-foreground",
        variant === "danger" && "bg-red-500/15 text-red-200",
        variant === "success" && "bg-emerald-500/15 text-emerald-200",
        className
      )}
      {...props}
    />
  );
}
