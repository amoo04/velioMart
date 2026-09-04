import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Package } from "lucide-react";
import { useOrderQuery, useUpdateOrderDelivery } from "../hooks/useOrders";
import StatusBadge from "../../../components/StatusBadge";
import { formatMoney } from "../../../lib/format";
import { resolveMediaUrl } from "../../../lib/api";

const DELIVERY_STATUSES = ["processing", "shipped", "out_for_delivery", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = Number(id);
  const { data: order, isLoading } = useOrderQuery(orderId);
  const updateDelivery = useUpdateOrderDelivery();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (!order) {
    return <p className="text-sm text-gray-500">Order not found.</p>;
  }

  const cancelled = order.delivery_status === "cancelled";

  const handleCancel = () => {
    if (confirm(`Cancel order ${order.order_code}? This cannot be undone.`)) {
      updateDelivery.mutate({ id: order.id, data: { delivery_status: "cancelled" } });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-black/5 hover:text-gray-700"
          aria-label="Back to orders"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">
          Order {order.order_code}
        </h1>
        <StatusBadge status={order.delivery_status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-brand-black-soft p-6">
          <h2 className="font-serif-brand text-base font-semibold text-white">Order Details</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Order Number</dt>
              <dd className="font-medium text-white">{order.order_code}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="text-gray-200">
                {new Date(order.created_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Delivery Fee</dt>
                <dd className="text-gray-200">₦{formatMoney(order.delivery_fee)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Total</dt>
              <dd className={cancelled ? "text-gray-500 line-through" : "text-gray-200"}>
                ₦{formatMoney(order.total_amount)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Payment</dt>
              <dd>
                <StatusBadge status={order.payment_status} />
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Update Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DELIVERY_STATUSES.map((status) => (
                <button
                  key={status}
                  disabled={updateDelivery.isPending}
                  onClick={() => updateDelivery.mutate({ id: order.id, data: { delivery_status: status } })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition disabled:opacity-60 ${
                    order.delivery_status === status
                      ? "bg-brand-gold text-brand-black"
                      : "bg-white/5 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {status.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {!cancelled && (
            <button
              onClick={handleCancel}
              disabled={updateDelivery.isPending}
              className="mt-4 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-60"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="rounded-xl bg-brand-black-soft p-6">
          <h2 className="font-serif-brand text-base font-semibold text-white">Customer</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="text-white">{order.customer_name ?? "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-200">{order.customer_email ?? "—"}</p>
            </div>
            {order.customer_phone && (
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-200">{order.customer_phone}</p>
              </div>
            )}
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Shipping Address</p>
              <p className="mt-1 text-gray-200">{order.shipping_address ?? "No address provided"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-brand-black-soft p-6">
        <h2 className="font-serif-brand text-base font-semibold text-white">
          Items ({order.items.length})
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-white/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                {item.product_image_url ? (
                  <img
                    src={resolveMediaUrl(item.product_image_url)}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Package className="h-5 w-5 text-gray-500" strokeWidth={1.75} />
                  </div>
                )}
                <div>
                  <Link
                    to={`/products?search=${encodeURIComponent(item.product_name ?? "")}`}
                    className="font-medium text-white hover:text-brand-gold"
                  >
                    {item.product_name ?? `Product #${item.product_id}`}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">
                    Qty: {item.quantity} · ₦{formatMoney(item.price)} each
                  </p>
                </div>
              </div>
              <p className="font-medium text-gray-200">₦{formatMoney(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-medium text-gray-400">Total</span>
          <span className="text-base font-semibold text-white">₦{formatMoney(order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
}
