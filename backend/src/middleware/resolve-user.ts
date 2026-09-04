import type { MiddlewareHandler } from "hono";
import type { JwtPayload } from "../lib/jwt";
import { authRepository } from "../modules/auth/auth.repository";

export type ResolvedUser = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
};

declare module "hono" {
  interface ContextVariableMap {
    user: ResolvedUser;
  }
}

export const resolveUser: MiddlewareHandler = async (c, next) => {
  const payload = c.get("jwtPayload") as JwtPayload;
  if (!payload) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const user = await authRepository.findByUuid(payload.sub);
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  c.set("user", {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  await next();
};
