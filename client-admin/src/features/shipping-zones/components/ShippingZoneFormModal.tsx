import { useState, type FormEvent } from "react";
import { MapPin, Truck, Wallet } from "lucide-react";
import Modal from "../../../components/Modal";
import { useCreateShippingZone, useUpdateShippingZone } from "../hooks/useShippingZones";
import { dollarsToCents } from "../../../lib/format";
import { NIGERIA_STATES } from "../constants";
import type { ShippingZone } from "../api/shipping-zones.api";

interface ShippingZoneFormModalProps {
  zone?: ShippingZone;
  onClose: () => void;
}

const DELIVERY_PRESETS = ["1-2 Working Days", "2-4 Working Days", "3-5 Working Days", "5-7 Working Days"];

function parseStates(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ShippingZoneFormModal({ zone, onClose }: ShippingZoneFormModalProps) {
  const createZone = useCreateShippingZone();
  const updateZone = useUpdateShippingZone();

  const [name, setName] = useState(zone?.name ?? "");
  const [states, setStates] = useState<string[]>(zone ? parseStates(zone.states) : []);
  const [deliveryEstimate, setDeliveryEstimate] = useState(zone?.deliveryEstimate ?? "");
  const [rate, setRate] = useState(zone ? String(zone.rate / 100) : "");
  const [error, setError] = useState<string | null>(null);

  const isPending = createZone.isPending || updateZone.isPending;

  const toggleState = (state: string) => {
    setStates((prev) => (prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!states.length) {
      setError("Select at least one state");
      return;
    }

    const data = {
      name,
      states: states.join(", "),
      deliveryEstimate,
      rate: dollarsToCents(Number(rate)),
    };

    try {
      if (zone) {
        await updateZone.mutateAsync({ id: zone.id, data });
      } else {
        await createZone.mutateAsync(data);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Modal
      title={zone ? "Edit Shipping Zone" : "Add Shipping Zone"}
      onClose={onClose}
      variant="dark"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Zone Name</label>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. South East"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
              States Covered
            </label>
            <span className="text-xs text-gray-500">{states.length} state(s) selected</span>
          </div>
          <div className="grid max-h-48 grid-cols-4 gap-x-3 gap-y-2 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3">
            {NIGERIA_STATES.map((state) => (
              <label
                key={state}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={states.includes(state)}
                  onChange={() => toggleState(state)}
                  className="h-3.5 w-3.5 rounded border-gray-500 accent-brand-gold"
                />
                {state}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
              <Truck className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
              Delivery Estimate
            </label>
            <input
              required
              list="delivery-presets"
              value={deliveryEstimate}
              onChange={(e) => setDeliveryEstimate(e.target.value)}
              placeholder="1-2 Working Days"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
            <datalist id="delivery-presets">
              {DELIVERY_PRESETS.map((preset) => (
                <option key={preset} value={preset} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
              <Wallet className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
              Rate
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 pl-3 transition-colors focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold">
              <span className="text-sm text-gray-500">₦</span>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border-none bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none"
              />
            </div>
          </div>
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
            disabled={isPending}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft disabled:opacity-60"
          >
            {isPending ? "Saving..." : zone ? "Save Changes" : "Create Zone"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
