import { View, Text, StyleSheet } from "react-native";
import ProductImage from "../../../components/ProductImage";
import { formatPrice } from "../../../lib/format";
import type { OrderItem } from "../slice/ordersSlice";
import type { Product } from "../../Products/hooks/useProducts";

export default function OrderItemRow({ item, product }: { item: OrderItem; product?: Product }) {
  return (
    <View style={styles.itemRow}>
      <ProductImage uri={product?.image_url} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {product?.name ?? `Product #${item.product_id}`}
        </Text>
        <Text style={styles.itemMeta}>
          Qty {item.quantity} · ₦{formatPrice(item.price)} each
        </Text>
      </View>
      <Text style={styles.itemTotal}>₦{formatPrice(item.price * item.quantity)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemMeta: {
    fontSize: 13,
    color: "#999",
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },
});
