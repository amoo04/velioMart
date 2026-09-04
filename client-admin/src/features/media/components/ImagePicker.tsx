import { useRef, useState } from "react";
import { ImagePlus, Library, X } from "lucide-react";
import { useUploadMedia } from "../hooks/useMedia";
import MediaPickerModal from "./MediaPickerModal";
import { resolveMediaUrl } from "../../../lib/api";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif";

interface ImagePickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const uploadMedia = useUploadMedia();
  const [showLibrary, setShowLibrary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    try {
      const item = await uploadMedia.mutateAsync(file);
      onChange(item.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-fit">
          <img
            src={resolveMediaUrl(value)}
            alt=""
            className="h-28 w-28 rounded-lg border border-white/10 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 rounded-full bg-brand-black p-1 text-gray-300 hover:text-red-400"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:border-brand-gold hover:text-brand-gold disabled:opacity-60"
          >
            <ImagePlus className="h-3.5 w-3.5" strokeWidth={2} />
            {uploadMedia.isPending ? "Uploading..." : "Upload Image"}
          </button>
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:border-brand-gold hover:text-brand-gold"
          >
            <Library className="h-3.5 w-3.5" strokeWidth={2} />
            Choose from Library
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {showLibrary && (
        <MediaPickerModal
          onSelect={(url) => {
            onChange(url);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
