import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../store-config/store";
import type { CartItem as CartItemType } from "../features/cart/slice/cartSlice";
import { useUpdateCartQuantity, useRemoveFromCart } from "../features/cart/hooks/useUpdateCart";
import { formatPrice } from "../lib/format";
import ProductImage from "./ProductImage";

interface Props {
  item: CartItemType;
  onPress: () => void;
}

export default function CartItemRow({ item, onPress }: Props) {
  const product = useSelector((state: RootState) =>
    state.products.list.find((p) => p.id === item.product_id),
  );
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  if (!product) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <ProductImage uri={product.image_url} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand ?? ""}</Text>
        <Text style={styles.price}>₦{formatPrice(product.price)}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => {
              if (item.quantity <= 1) {
                removeItem.mutate(item.product_id);
              } else {
                updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity - 1 });
              }
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="remove" size={16} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity + 1 })}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="add" size={16} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem.mutate(item.product_id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 0,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 14,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: "auto",
    padding: 4,
  },
});
