import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePaymentsQuery } from "../hooks/usePayments";
import { formatPrice } from "../../../lib/format";

const statusColors: Record<string, string> = {
  pending: "#f39c12",
  success: "#27ae60",
  failed: "#e74c3c",
};

export default function PaymentsScreen() {
  const navigation = useNavigation();
  const { data: payments = [], isLoading: loading } = usePaymentsQuery();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Payments</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const status = item.payment_status.toLowerCase();
            return (
              <View style={styles.card}>
                <View style={styles.topRow}>
                  <Text style={styles.orderId}>Order #{item.order_id}</Text>
                  <View style={[styles.badge, { backgroundColor: (statusColors[status] || "#888") + "20" }]}>
                    <Text style={[styles.badgeText, { color: statusColors[status] || "#888" }]}>
                      {item.payment_status}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.value}>₦{formatPrice(item.amount)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Method</Text>
                  <Text style={styles.value}>{(item.payment_method ?? "—").replace(/_/g, " ")}</Text>
                </View>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="card-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No payments yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 14,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 8,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: 14, fontWeight: "600" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  detailRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 14, color: "#888" },
  value: { fontSize: 14, fontWeight: "500", color: "#333", textTransform: "capitalize" },
  date: { fontSize: 12, color: "#bbb", marginTop: 4 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: "#999" },
});
