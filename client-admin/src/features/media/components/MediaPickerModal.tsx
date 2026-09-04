import { useState } from "react";
import Modal from "../../../components/Modal";
import { useMediaQuery } from "../hooks/useMedia";
import { resolveMediaUrl } from "../../../lib/api";

interface MediaPickerModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const [search, setSearch] = useState("");
  const { data: items = [], isLoading } = useMediaQuery(search || undefined);

  return (
    <Modal title="Choose from Library" onClose={onClose} variant="dark" maxWidth="max-w-2xl">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search images by alt text or tags..."
        className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
      />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No images found. Upload one first.</p>
      ) : (
        <div className="grid max-h-96 grid-cols-4 gap-3 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.url)}
              className="group overflow-hidden rounded-lg border border-white/10 bg-black/20 transition-colors hover:border-brand-gold"
            >
              <div className="flex h-24 items-center justify-center">
                <img
                  src={resolveMediaUrl(item.url)}
                  alt={item.altText ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
