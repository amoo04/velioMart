import { useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
  useShippingZonesQuery, useMoveShippingZone, useDeleteShippingZone,
} from "../hooks/useShippingZones";
import ShippingZoneFormModal from "../components/ShippingZoneFormModal";
import { formatMoney } from "../../../lib/format";
import type { ShippingZone } from "../api/shipping-zones.api";

export default function ShippingZonesPage() {
  const { data: zones = [], isLoading } = useShippingZonesQuery();
  const moveZone = useMoveShippingZone();
  const deleteZone = useDeleteShippingZone();
  const [editing, setEditing] = useState<ShippingZone | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleDelete = (zone: ShippingZone) => {
    if (confirm(`Delete "${zone.name}"? This cannot be undone.`)) {
      deleteZone.mutate(zone.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Shipping Zones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define geographic zones, rates, and delivery estimates
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft"
        >
          + Add Zone
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : zones.length === 0 ? (
        <p className="text-sm text-gray-500">No shipping zones yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {zones.map((zone, index) => (
            <div key={zone.id} className="flex items-start justify-between rounded-xl bg-brand-black-soft p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex flex-col text-gray-500">
                  <button
                    disabled={index === 0}
                    onClick={() => moveZone.mutate({ id: zone.id, direction: "up" })}
                    className="hover:text-brand-gold disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={index === zones.length - 1}
                    onClick={() => moveZone.mutate({ id: zone.id, direction: "down" })}
                    className="hover:text-brand-gold disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-serif-brand text-base font-semibold text-white">{zone.name}</p>
                  <div className="mt-2 flex flex-col gap-1 text-sm">
                    <p className="text-gray-400">
                      <span className="text-gray-500">States:</span> {zone.states}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-500">Delivery:</span> {zone.deliveryEstimate}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-500">Rate:</span> ₦{formatMoney(zone.rate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEditing(zone)}
                  className="text-gray-400 hover:text-brand-gold"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => handleDelete(zone)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <ShippingZoneFormModal onClose={() => setShowCreate(false)} />}
      {editing && <ShippingZoneFormModal zone={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
