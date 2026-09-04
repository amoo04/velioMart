import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err.message.includes("duplicate key")) {
    return c.json({ error: "Email already exists" }, 409);
  }

  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
};
