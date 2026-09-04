import { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import OrderCard, { isActiveDeliveryStatus } from "../../../components/OrderCard";
import { useOrdersQuery } from "../hooks/useOrders";
import { useAddToCart } from "../../cart/hooks/useUpdateCart";
import type { Order } from "../slice/ordersSlice";
import type { RootStackParamList, TabParamList } from "../../../navigation/types";

type OrdersNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Orders">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Tab = "ACTIVE" | "COMPLETED" | "CANCEL";

const tabs: { key: Tab; label: string }[] = [
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCEL", label: "Cancel" },
];

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersNavigationProp>();
  const [activeTab, setActiveTab] = useState<Tab>("ACTIVE");
  const { data: orders = [], isLoading: loading } = useOrdersQuery();
  const addToCart = useAddToCart();

  const filtered = useMemo(() => {
    switch (activeTab) {
      case "ACTIVE":
        return orders.filter((o) => isActiveDeliveryStatus(o.delivery_status));
      case "COMPLETED":
        return orders.filter((o) => o.delivery_status.toLowerCase() === "delivered");
      case "CANCEL":
        return orders.filter((o) => o.delivery_status.toLowerCase() === "cancelled");
    }
  }, [orders, activeTab]);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart.mutate({ productId: item.product_id, quantity: item.quantity });
    });
    Alert.alert("Reordered", "Items have been added to your cart.");
  };

  const handleTrack = (order: Order) => {
    navigation.navigate("OrderDetail", { id: String(order.id) });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate("OrderDetail", { id: String(item.id) })}
              onTrack={isActiveDeliveryStatus(item.delivery_status) ? () => handleTrack(item) : undefined}
              onReorder={!isActiveDeliveryStatus(item.delivery_status) ? () => handleReorder(item) : undefined}
            />
          )}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
