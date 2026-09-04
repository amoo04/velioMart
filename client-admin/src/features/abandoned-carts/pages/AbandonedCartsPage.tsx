import { useState } from "react";
import { AlertTriangle, Mail, TrendingUp, DollarSign, RefreshCw, Trash2 } from "lucide-react";
import {
  useAbandonedCartsQuery, useProcessReminders, useDeleteAbandonedCart,
} from "../hooks/useAbandonedCarts";
import { formatMoney, formatDate } from "../../../lib/format";

const THRESHOLD_KEY = "abandoned_cart_threshold_hours";

function getStoredThreshold(): number {
  const raw = localStorage.getItem(THRESHOLD_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
}

export default function AbandonedCartsPage() {
  const [thresholdHours, setThresholdHours] = useState(getStoredThreshold);
  const [tab, setTab] = useState<"carts" | "settings">("carts");
  const { data, isLoading, refetch, isFetching } = useAbandonedCartsQuery(thresholdHours);
  const processReminders = useProcessReminders();
  const deleteCart = useDeleteAbandonedCart();

  const saveThreshold = (hours: number) => {
    setThresholdHours(hours);
    localStorage.setItem(THRESHOLD_KEY, String(hours));
  };

  const handleDelete = (userId: number, email: string) => {
    if (confirm(`Clear the cart for ${email}? This cannot be undone.`)) {
      deleteCart.mutate(userId);
    }
  };

  const flaggedCount = data?.carts.filter((c) => c.flagged).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Abandoned Carts</h1>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg bg-brand-black px-4 py-2 text-sm font-medium text-brand-gold hover:bg-brand-black-soft disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} strokeWidth={2} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-brand-black-soft p-5">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            Flagged
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{data?.flagged ?? 0}</p>
        </div>
        <div className="rounded-xl bg-brand-black-soft p-5">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Mail className="h-4 w-4" strokeWidth={2} />
            Reminded
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{data?.reminded ?? 0}</p>
        </div>
        <div className="rounded-xl bg-brand-black-soft p-5">
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <TrendingUp className="h-4 w-4" strokeWidth={2} />
            Recovered
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">
            {data?.recovered ?? 0} <span className="text-sm font-normal text-gray-500">({data?.recoveredPercent ?? 0}%)</span>
          </p>
        </div>
        <div className="rounded-xl bg-brand-black-soft p-5">
          <div className="flex items-center gap-2 text-sm text-brand-gold">
            <DollarSign className="h-4 w-4" strokeWidth={2} />
            Revenue Recovered
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">₦{formatMoney(data?.revenueRecovered ?? 0)}</p>
        </div>
      </div>

      <div className="flex gap-6 border-b border-black/10 text-sm font-medium">
        <button
          onClick={() => setTab("carts")}
          className={`flex items-center gap-1.5 border-b-2 pb-2 ${
            tab === "carts" ? "border-brand-gold text-brand-gold" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Carts
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`flex items-center gap-1.5 border-b-2 pb-2 ${
            tab === "settings" ? "border-brand-gold text-brand-gold" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Settings
        </button>
      </div>

      {tab === "settings" ? (
        <div className="max-w-md rounded-xl bg-brand-black-soft p-6">
          <label className="text-sm font-medium text-gray-300">Abandonment Threshold (hours)</label>
          <p className="mt-1 text-xs text-gray-500">
            Carts untouched for this many hours are flagged as abandoned and become eligible for a
            reminder email.
          </p>
          <input
            type="number"
            min="1"
            value={thresholdHours}
            onChange={(e) => saveThreshold(Math.max(1, Number(e.target.value) || 1))}
            className="mt-3 w-32 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {flaggedCount} cart{flaggedCount === 1 ? "" : "s"} flagged (untouched for {thresholdHours}+ hours)
            </p>
            <button
              onClick={() => processReminders.mutate(thresholdHours)}
              disabled={processReminders.isPending || flaggedCount === 0}
              className="flex items-center gap-2 text-sm font-medium text-brand-gold hover:text-brand-gold-soft disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${processReminders.isPending ? "animate-spin" : ""}`} strokeWidth={2} />
              {processReminders.isPending ? "Sending..." : "Process All"}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl bg-brand-black-soft">
            {isLoading ? (
              <p className="p-6 text-sm text-gray-400">Loading...</p>
            ) : !data || data.carts.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No active carts.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Items</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Abandoned</th>
                    <th className="px-5 py-3 font-medium">Reminded</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data.carts.map((cartRow) => (
                    <tr key={cartRow.user_id}>
                      <td className="px-5 py-3 font-medium text-white">{cartRow.email}</td>
                      <td className="px-5 py-3 text-gray-400">{cartRow.items}</td>
                      <td className="px-5 py-3 text-gray-200">₦{formatMoney(cartRow.total)}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {cartRow.flagged ? formatDate(cartRow.abandoned_at) : "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-400">{cartRow.reminded_count}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                              cartRow.flagged
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-white/10 text-gray-300"
                            }`}
                          >
                            {cartRow.flagged ? "Flagged" : "Active"}
                          </span>
                          <button
                            onClick={() => handleDelete(cartRow.user_id, cartRow.email)}
                            className="text-gray-500 hover:text-red-400"
                            aria-label="Clear cart"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
