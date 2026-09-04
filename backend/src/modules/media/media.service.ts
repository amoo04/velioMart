import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { R2Bucket } from "@cloudflare/workers-types";
import { mediaRepository, type UpdateMediaData } from "./media.repository";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./media.schema";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media");

function extensionFor(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  return map[mimeType] ?? "bin";
}

export const mediaService = {
  async getAll(search?: string) {
    return mediaRepository.findAll(search);
  },

  async upload(file: File, bucket?: R2Bucket) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Unsupported file type. Allowed: JPEG, PNG, GIF, WebP, SVG, AVIF.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File exceeds the 10MB size limit.");
    }

    const filename = `${Date.now()}-${crypto.randomUUID()}.${extensionFor(file.type)}`;

    if (bucket) {
      await bucket.put(`media/${filename}`, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });
    } else {
      await mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    }

    return mediaRepository.create({
      filename,
      url: `/static/media/${filename}`,
      mimeType: file.type,
      size: file.size,
    });
  },

  async update(id: number, data: UpdateMediaData) {
    const item = await mediaRepository.findById(id);
    if (!item) {
      throw new Error("Media item not found");
    }
    return mediaRepository.update(id, data);
  },

  async remove(id: number, bucket?: R2Bucket) {
    const item = await mediaRepository.findById(id);
    if (!item) {
      throw new Error("Media item not found");
    }

    if (bucket) {
      await bucket.delete(`media/${item.filename}`).catch(() => {
        // object already missing in R2; still remove the DB record
      });
    } else {
      try {
        await unlink(path.join(UPLOAD_DIR, item.filename));
      } catch {
        // file already missing on disk; still remove the DB record
      }
    }

    return mediaRepository.delete(id);
  },
};
