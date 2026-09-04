import { useState } from "react";
import { MapPin, ChevronUp, ChevronDown, Power, Pencil, Trash2 } from "lucide-react";
import {
  useLocationsQuery, useCreateLocation, useUpdateLocation, useMoveLocation, useDeleteLocation,
} from "../hooks/useLocations";
import LocationFormModal from "../components/LocationFormModal";
import { NIGERIA_STATE_CODES, NIGERIA_STATES } from "../../../lib/nigeria-states";
import type { Location } from "../api/locations.api";

export default function LocationsPage() {
  const { data: locations = [], isLoading } = useLocationsQuery();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const moveLocation = useMoveLocation();
  const deleteLocation = useDeleteLocation();
  const [editing, setEditing] = useState<Location | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isAddingAll, setIsAddingAll] = useState(false);

  const missingStates = NIGERIA_STATES.filter(
    (state) => !locations.some((l) => l.name.toLowerCase() === state.toLowerCase()),
  );

  const handleAddAllStates = async () => {
    setIsAddingAll(true);
    try {
      for (const state of missingStates) {
        await createLocation.mutateAsync({ name: state, code: NIGERIA_STATE_CODES[state] });
      }
    } finally {
      setIsAddingAll(false);
    }
  };

  const toggleAll = () => {
    setSelected(selected.size === locations.length ? new Set() : new Set(locations.map((l) => l.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleDelete = (location: Location) => {
    if (confirm(`Delete "${location.name}"? This cannot be undone.`)) {
      deleteLocation.mutate(location.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Locations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage states and regions available at checkout</p>
        </div>
        <div className="flex items-center gap-2">
          {missingStates.length > 0 && (
            <button
              onClick={handleAddAllStates}
              disabled={isAddingAll}
              className="rounded-lg border border-brand-gold/40 px-4 py-2 text-sm font-medium text-brand-gold hover:bg-brand-gold/10 disabled:opacity-60"
            >
              {isAddingAll ? "Adding..." : `+ Add All States (${missingStates.length})`}
            </button>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-black hover:bg-brand-gold-soft"
          >
            + Add Location
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={selected.size === locations.length && locations.length > 0}
          onChange={toggleAll}
          className="accent-brand-gold"
        />
        {locations.length} total
      </label>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : locations.length === 0 ? (
        <p className="text-sm text-gray-500">No locations yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="flex items-center justify-between rounded-xl bg-brand-black-soft px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(location.id)}
                  onChange={() => toggleOne(location.id)}
                  className="accent-brand-gold"
                />
                <div className="flex flex-col text-gray-500">
                  <button
                    disabled={index === 0}
                    onClick={() => moveLocation.mutate({ id: location.id, direction: "up" })}
                    className="hover:text-brand-gold disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={index === locations.length - 1}
                    onClick={() => moveLocation.mutate({ id: location.id, direction: "down" })}
                    className="hover:text-brand-gold disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <MapPin className="h-4 w-4 text-brand-gold" strokeWidth={1.75} />
                <span className="font-medium text-white">{location.name}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-300">
                  {location.code}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateLocation.mutate({ id: location.id, data: { isActive: !location.isActive } })
                  }
                  title={location.isActive ? "Active — click to disable" : "Inactive — click to enable"}
                  className={location.isActive ? "text-emerald-500" : "text-gray-600"}
                >
                  <Power className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => setEditing(location)}
                  className="text-gray-400 hover:text-brand-gold"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => handleDelete(location)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <LocationFormModal onClose={() => setShowCreate(false)} />}
      {editing && <LocationFormModal location={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
