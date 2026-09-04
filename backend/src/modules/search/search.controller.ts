import type { Context } from "hono";
import { searchService } from "./search.service";
import { searchQuerySchema } from "./search.schema";

export const searchController = {
  async search(c: Context) {
    try {
      const query = c.req.query();
      const parsed = searchQuerySchema.safeParse(query);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await searchService.search(parsed.data);
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
