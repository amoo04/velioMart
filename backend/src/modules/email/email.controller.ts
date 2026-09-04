import type { Context } from "hono";
import { emailService } from "./email.service";
import { sendEmailSchema } from "./email.schema";
import type { JwtPayload } from "../../lib/jwt";

export const emailController = {
  async sendEmail(c: Context) {
    try {
      const user = c.get("jwtPayload") as JwtPayload;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const body = await c.req.json();
      const parsed = sendEmailSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await emailService.sendEmail(parsed.data);
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
