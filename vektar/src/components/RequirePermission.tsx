import type { ReactNode } from "react";
import { useAuth } from "../lib/auth-context";
import type { Permission } from "../lib/permissions";

export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) return null;
  return <>{children}</>;
}

export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}
