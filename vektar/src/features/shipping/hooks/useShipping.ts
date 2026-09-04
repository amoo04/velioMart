import { useQuery } from "@tanstack/react-query";
import { fetchShippingZones } from "../api/shipping.api";
import type { ShippingZone } from "../api/shipping.api";

export function useShippingZonesQuery() {
  return useQuery({
    queryKey: ["shipping-zones"],
    queryFn: fetchShippingZones,
  });
}

/**
 * Shipping zones store their coverage as a free-text comma list (e.g. "Lagos, Ogun").
 * Matches a state name against that list case-insensitively.
 */
export function findZoneForState(zones: ShippingZone[], stateName: string): ShippingZone | null {
  const needle = stateName.trim().toLowerCase();
  if (!needle) return null;
  return (
    zones.find((zone) =>
      zone.states
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .includes(needle),
    ) ?? null
  );
}

/** Best-effort: find which covered state (if any) appears inside a free-text address. */
export function detectStateFromAddress(zones: ShippingZone[], address: string): string | null {
  const haystack = address.toLowerCase();
  for (const zone of zones) {
    for (const state of zone.states.split(",").map((s) => s.trim())) {
      if (state && haystack.includes(state.toLowerCase())) {
        return state;
      }
    }
  }
  return null;
}

export function allCoveredStates(zones: ShippingZone[]): string[] {
  const set = new Set<string>();
  for (const zone of zones) {
    for (const state of zone.states.split(",").map((s) => s.trim())) {
      if (state) set.add(state);
    }
  }
  return [...set].sort();
}
