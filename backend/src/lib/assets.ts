import type { Context } from "hono";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Bindings } from "../index";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

function mimeFor(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

/**
 * Serves a file by key (e.g. "media/xyz.png", "products/abc.png").
 * Reads from the R2 binding when present (Cloudflare Workers deployment);
 * falls back to ./public on local disk when running locally under Bun,
 * where no R2 binding is available.
 */
export async function serveAsset(c: Context<{ Bindings: Bindings }>, key: string): Promise<Response> {
  const bucket = c.env?.PRODUCT_IMAGES;

  if (bucket) {
    const object = await bucket.get(key);
    if (!object) return c.notFound();
    return new Response(object.body as unknown as BodyInit, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType ?? mimeFor(key),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  try {
    const filePath = path.join(process.cwd(), "public", key);
    const data = await readFile(filePath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mimeFor(key),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return c.notFound();
  }
}
