export type Role = "admin" | "retailer" | "customer";

export type Permission =
  | "manage:products"
  | "manage:orders"
  | "manage:users"
  | "view:admin-dashboard";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["manage:products", "manage:orders", "manage:users", "view:admin-dashboard"],
  retailer: ["manage:products", "manage:orders"],
  customer: [],
};

function normalizeRole(role: string | undefined | null): Role {
  return role === "admin" || role === "retailer" || role === "customer" ? role : "customer";
}

export function hasPermission(role: string | undefined | null, permission: Permission): boolean {
  return ROLE_PERMISSIONS[normalizeRole(role)].includes(permission);
}

export function isAdmin(role: string | undefined | null): boolean {
  return normalizeRole(role) === "admin";
}

export function isRetailer(role: string | undefined | null): boolean {
  return normalizeRole(role) === "retailer";
}
