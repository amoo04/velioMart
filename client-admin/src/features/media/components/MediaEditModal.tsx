import { useState, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import { useUpdateMedia } from "../hooks/useMedia";
import { resolveMediaUrl } from "../../../lib/api";
import type { MediaItem } from "../api/media.api";

interface MediaEditModalProps {
  item: MediaItem;
  onClose: () => void;
}

export default function MediaEditModal({ item, onClose }: MediaEditModalProps) {
  const updateMedia = useUpdateMedia();
  const [altText, setAltText] = useState(item.altText ?? "");
  const [tags, setTags] = useState(item.tags ?? "");
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateMedia.mutateAsync({ id: item.id, data: { altText: altText || null, tags: tags || null } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Modal title="Edit Media" onClose={onClose} variant="dark">
      <div className="mb-4 flex justify-center">
        <img
          src={resolveMediaUrl(item.url)}
          alt={item.altText ?? ""}
          className="h-40 w-40 rounded-lg border border-white/10 object-cover"
        />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Alt Text</label>
          <input
            autoFocus
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. perfume, gold, bottle"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMedia.isPending}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft disabled:opacity-60"
          >
            {updateMedia.isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
