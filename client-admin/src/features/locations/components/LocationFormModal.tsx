import { useState, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import { useCreateLocation, useUpdateLocation } from "../hooks/useLocations";
import type { Location } from "../api/locations.api";

interface LocationFormModalProps {
  location?: Location;
  onClose: () => void;
}

export default function LocationFormModal({ location, onClose }: LocationFormModalProps) {
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();

  const [name, setName] = useState(location?.name ?? "");
  const [code, setCode] = useState(location?.code ?? "");
  const [isActive, setIsActive] = useState(location?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  const isPending = createLocation.isPending || updateLocation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = { name, code: code.toUpperCase(), isActive };

    try {
      if (location) {
        await updateLocation.mutateAsync({ id: location.id, data });
      } else {
        await createLocation.mutateAsync(data);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Modal title={location ? "Edit Location" : "Add Location"} onClose={onClose} variant="dark">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">State / Region Name</label>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Code</label>
          <input
            required
            maxLength={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. AB"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm uppercase text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-500 accent-brand-gold"
          />
          <span className="text-sm font-medium text-gray-300">Active at checkout</span>
        </label>

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
            disabled={isPending}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
