import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { formatPrice } from "../../../lib/format";
import { TRANSFER_DETAILS } from "../transferDetails";

export default function OrderConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderId, amount } = useRoute<RouteProp<RootStackParamList, "OrderConfirmation">>().params;
  const [hasNotifiedPaid, setHasNotifiedPaid] = useState(false);

  const handleIvePaid = () => {
    setHasNotifiedPaid(true);
    Alert.alert(
      "Thanks!",
      "We'll confirm your payment shortly and get your order ready.",
      [{ text: "OK", onPress: () => navigation.replace("OrderDetail", { id: orderId }) }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.checkCircle}>
          <Ionicons name="time-outline" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Order Placed — Awaiting Payment</Text>
        {orderId && <Text style={styles.orderNumber}>Order #{orderId}</Text>}
        <Text style={styles.subtitle}>
          Your order is saved but not yet confirmed. Transfer the amount below to complete it.
        </Text>

        <View style={styles.transferCard}>
          <Text style={styles.transferTitle}>Transfer to this account</Text>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Bank</Text>
            <Text style={styles.transferValue} selectable>{TRANSFER_DETAILS.bank}</Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Account Number</Text>
            <Text style={styles.transferValue} selectable>{TRANSFER_DETAILS.accountNumber}</Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Account Name</Text>
            <Text style={styles.transferValue} selectable>{TRANSFER_DETAILS.accountName}</Text>
          </View>
          <View style={[styles.transferRow, styles.amountRow]}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>₦{formatPrice(amount)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, hasNotifiedPaid && styles.primaryButtonDisabled]}
          onPress={handleIvePaid}
          disabled={hasNotifiedPaid}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.primaryText}>{hasNotifiedPaid ? "Thanks — We'll Confirm Soon" : "I've Made the Transfer"}</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.replace("Tabs", undefined)}
        >
          <Text style={styles.secondaryText}>Continue Shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f39c12",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  orderNumber: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  transferCard: {
    width: "100%",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    gap: 8,
  },
  transferTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 4 },
  transferRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  transferLabel: { fontSize: 13, color: "#888" },
  transferValue: { fontSize: 14, fontWeight: "600", color: "#000" },
  amountRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  amountLabel: { fontSize: 14, fontWeight: "700", color: "#000" },
  amountValue: { fontSize: 16, fontWeight: "700", color: "#000" },
  actions: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 14,
  },
  secondaryText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
});
