import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../store-config/store";
import type { Order } from "../features/orders/slice/ordersSlice";
import { formatPrice } from "../lib/format";
import ProductImage from "./ProductImage";

interface Props {
  order: Order;
  onPress: () => void;
  onTrack?: () => void;
  onReorder?: () => void;
}

const deliveryLabels: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function isActiveDeliveryStatus(status: string): boolean {
  return !["delivered", "cancelled"].includes(status.toLowerCase());
}

export function getDeliveryStatusLabel(status: string): string {
  return deliveryLabels[status.toLowerCase()] ?? status;
}

export default function OrderCard({ order, onPress, onTrack, onReorder }: Props) {
  const products = useSelector((state: RootState) => state.products.list);
  const active = isActiveDeliveryStatus(order.delivery_status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstItem = order.items[0];
  const product = firstItem ? products.find((p) => p.id === firstItem.product_id) : undefined;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <ProductImage uri={product?.image_url} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product?.name ?? `Order #${order.id}`}
          {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
        </Text>
        <Text style={styles.brand}>{itemCount} item{itemCount === 1 ? "" : "s"} · #{order.id}</Text>
        <Text style={styles.price}>₦{formatPrice(order.total_amount)}</Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, active ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusText, { color: active ? "#fff" : "#888" }]}>
              {getDeliveryStatusLabel(order.delivery_status)}
            </Text>
          </View>
        </View>

        {active && onTrack && (
          <TouchableOpacity style={styles.trackButton} onPress={onTrack} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text style={styles.trackText}>Track Order</Text>
          </TouchableOpacity>
        )}

        {!active && onReorder && (
          <TouchableOpacity style={styles.reorderButton} onPress={onReorder} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={16} color="#000" />
            <Text style={styles.reorderText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  brand: {
    fontSize: 13,
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: "#007AFF",
  },
  statusInactive: {
    backgroundColor: "#f0f0f0",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  trackText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  reorderText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
  },
});
