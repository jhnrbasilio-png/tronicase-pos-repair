export const roles = [
  "SUPER_ADMIN",
  "ADMIN",
  "BRANCH_MANAGER",
  "CASHIER",
  "TECHNICIAN",
  "DEVELOPER"
] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  BRANCH_MANAGER: "Branch Manager",
  CASHIER: "Sales Lady / Cashier",
  TECHNICIAN: "Technician",
  DEVELOPER: "Developer"
};

export const permissions: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "dashboard:read",
    "pos:write",
    "products:write",
    "repairs:create",
    "repairs:write",
    "reports:read",
    "expenses:create",
    "expenses:write",
    "branches:write",
    "notifications:read",
    "notifications:write"
  ],
  BRANCH_MANAGER: [
    "dashboard:read",
    "pos:write",
    "products:write",
    "repairs:create",
    "repairs:write",
    "reports:read",
    "expenses:create",
    "expenses:write",
    "notifications:read"
  ],
  CASHIER: ["dashboard:read", "pos:write", "repairs:create", "expenses:create", "notifications:read"],
  TECHNICIAN: ["repairs:write", "notifications:read"],
  DEVELOPER: ["*", "system:debug"]
};

export function can(role: Role, action: string) {
  return permissions[role]?.includes("*") || permissions[role]?.includes(action);
}
