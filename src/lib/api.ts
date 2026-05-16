import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
}

export function requirePermission(action: string) {
  const user = getCurrentUser();
  if (!user) return { user: null, response: unauthorized() };
  if (!can(user.role, action)) return { user, response: forbidden() };
  return { user, response: null };
}

export function apiError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: "Request failed" }, { status: 500 });
}
