/**
 * One-time migration: uploads everything under ./public into the R2 bucket
 * declared in wrangler.jsonc, preserving the same relative path as the R2 key
 * (e.g. public/media/foo.png -> key "media/foo.png"), so existing
 * /static/... URLs keep resolving after cutting over from local disk to R2.
 *
 * Requires `wrangler login` to have been run first.
 * Usage:
 *   bun run scripts/migrate-assets-to-r2.ts
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const bucketName = "project-images";

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(PUBLIC_DIR);
  if (!files.length) {
    console.log("No files found under ./public — nothing to migrate.");
    return;
  }

  console.log(`Uploading ${files.length} file(s) to R2 bucket "${bucketName}"...`);

  for (const file of files) {
    const key = path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
    const result = spawnSync(
      "npx",
      ["wrangler", "r2", "object", "put", `${bucketName}/${key}`, "--file", file, "--remote"],
      { stdio: "inherit" },
    );
    if (result.status !== 0) {
      console.error(`Failed to upload ${key}`);
      process.exitCode = 1;
    }
  }
}

main();
