import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store-config/store";
import type { RootStackParamList, TabParamList } from "../../../navigation/types";
import CartItemRow from "../../../components/CartItem";
import { useCartQuery, useCartSummary } from "../hooks/useCart";
import { useClearCart } from "../hooks/useUpdateCart";
import { useProductsQuery } from "../../Products/hooks/useProducts";
import { formatPrice } from "../../../lib/format";

type CartNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Cart">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function CartScreen() {
  const navigation = useNavigation<CartNavigationProp>();
  const { isLoading: cartLoading } = useCartQuery();
  const { isLoading: productsLoading } = useProductsQuery();
  const loading = cartLoading || productsLoading;
  const cart = useSelector((state: RootState) => state.cart.items);
  const summary = useCartSummary();
  const clearCart = useClearCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate("Checkout");
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearCart.mutate() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Cart</Text>
        {cart.length > 0 && (
          <Pressable onPress={handleClearCart} style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
          </Pressable>
        )}
        {cart.length === 0 && <View style={styles.iconButton} />}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : cart.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={56} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse products and add items to get started</Text>
          <Pressable
            style={styles.shopButton}
            onPress={() => navigation.navigate("Products", undefined)}
          >
            <Text style={styles.shopButtonText}>Browse Products</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => String(item.product_id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onPress={() => navigation.navigate("ProductDetail", { id: String(item.product_id) })}
              />
            )}
          />

          <View style={styles.footer}>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items</Text>
                <Text style={styles.summaryValue}>{summary.itemCount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₦{formatPrice(summary.subtotal)}</Text>
              </View>
              <Text style={styles.deliveryNote}>Delivery fee calculated at checkout</Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Check Out</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  summary: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  deliveryNote: {
    fontSize: 12,
    color: "#999",
    marginTop: -2,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
