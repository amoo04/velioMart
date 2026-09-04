import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store-config/store";
import type { RootStackParamList } from "../../../navigation/types";
import { useOrderQuery } from "../hooks/useOrders";
import { useAddToCart } from "../../cart/hooks/useUpdateCart";
import { isActiveDeliveryStatus } from "../../../components/OrderCard";
import { formatPrice } from "../../../lib/format";
import OrderItemRow from "../components/OrderItemRow";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";

export default function OrderDetailScreen() {
  const { id } = useRoute<RouteProp<RootStackParamList, "OrderDetail">>().params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const products = useSelector((state: RootState) => state.products.list);
  const { data: order, isLoading } = useOrderQuery(id);
  const addToCart = useAddToCart();

  if (isLoading || !order) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        {isLoading ? <ActivityIndicator size="large" color="#000" /> : <Text>Order not found</Text>}
      </SafeAreaView>
    );
  }

  const status = order.delivery_status.toLowerCase();
  const active = isActiveDeliveryStatus(status);

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart.mutate({ productId: item.product_id, quantity: item.quantity });
    });
    Alert.alert("Reordered", "Items have been added to your cart.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.date}>Placed on {new Date(order.created_at).toLocaleDateString()}</Text>
          {order.shipping_address && <Text style={styles.address}>{order.shipping_address}</Text>}
          <Text style={styles.price}>Total: ₦{formatPrice(order.total_amount)}</Text>
          <Text style={styles.paymentStatus}>Payment: {order.payment_status}</Text>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item) => (
            <OrderItemRow
              key={item.id}
              item={item}
              product={products.find((p) => p.id === item.product_id)}
            />
          ))}
        </View>

        {status === "cancelled" && (
          <View style={styles.cancelBanner}>
            <Ionicons name="information-circle" size={18} color="#e74c3c" />
            <Text style={styles.cancelText}>This order was cancelled.</Text>
          </View>
        )}

        {active && <OrderTrackingTimeline status={status} />}

        {!active && (
          <View style={styles.reorderSection}>
            <Pressable style={styles.reorderButton} onPress={handleReorder}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.reorderText}>Reorder</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  orderInfo: {
    padding: 20,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
  },
  date: {
    fontSize: 13,
    color: "#999",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginTop: 8,
  },
  paymentStatus: {
    fontSize: 13,
    color: "#999",
    textTransform: "capitalize",
  },
  itemsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  cancelBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "500",
    flex: 1,
  },
  reorderSection: {
    padding: 20,
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
  },
  reorderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
