import type { Context } from "hono";
import { imagesService } from "./images.service";
import { uploadImageSchema } from "./images.schema";
import type { JwtPayload } from "../../lib/jwt";

export const imagesController = {
  async uploadImage(c: Context) {
    try {
      const user = c.get("jwtPayload") as JwtPayload;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const body = await c.req.json();
      const parsed = uploadImageSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await imagesService.uploadImage(parsed.data);
      return c.json(result, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
