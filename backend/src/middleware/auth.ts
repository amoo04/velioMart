import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";
import { JWT_SECRET } from "../lib/jwt";

export const authMiddleware: MiddlewareHandler = (c, next) => {
  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  });
  return jwtMiddleware(c, next);
};
