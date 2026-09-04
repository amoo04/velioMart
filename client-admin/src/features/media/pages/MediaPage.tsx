import { useRef, useState } from "react";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useMediaQuery, useUploadMedia, useDeleteMedia } from "../hooks/useMedia";
import MediaEditModal from "../components/MediaEditModal";
import SearchBar from "../../../components/SearchBar";
import { resolveMediaUrl } from "../../../lib/api";
import type { MediaItem } from "../api/media.api";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif";

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const { data: items = [], isLoading } = useMediaQuery(search || undefined);
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploadError(null);
    for (const file of Array.from(files)) {
      try {
        await uploadMedia.mutateAsync(file);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (item: MediaItem) => {
    if (confirm("Delete this image? This cannot be undone.")) {
      deleteMedia.mutate(item.id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selected.size} selected image${selected.size === 1 ? "" : "s"}?`)) {
      selected.forEach((id) => deleteMedia.mutate(id));
      setSelected(new Set());
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">JPEG, PNG, GIF, WebP, SVG, AVIF — Max 10MB</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
            className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft disabled:opacity-60"
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            {uploadMedia.isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {uploadError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{uploadError}</p>
      )}

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search images by alt text or tags..." onSearch={setSearch} />
        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="shrink-0 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/25"
          >
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {items.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={selected.size === items.length && items.length > 0}
            onChange={toggleAll}
            className="accent-brand-gold"
          />
          Select all
        </label>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No images yet. Click "Upload" to add your first image.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-brand-black-soft"
            >
              <label className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggleOne(item.id)}
                  className="h-4 w-4 accent-brand-gold"
                />
              </label>

              <div className="flex h-36 items-center justify-center bg-black/20">
                <img
                  src={resolveMediaUrl(item.url)}
                  alt={item.altText ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-gray-400">{item.altText || "No alt text"}</span>
                <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(item)}
                    className="text-gray-400 hover:text-brand-gold"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-gray-400 hover:text-red-400"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <MediaEditModal item={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
