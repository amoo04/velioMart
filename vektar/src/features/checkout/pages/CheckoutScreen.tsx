import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, ActivityIndicator, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store-config/store";
import type { RootStackParamList } from "../../../navigation/types";
import { useCartSummary } from "../../cart/hooks/useCart";
import { usePlaceOrder } from "../hooks/useCheckout";
import { useProductsQuery } from "../../Products/hooks/useProducts";
import { useProfileQuery } from "../../profile/hooks/useProfile";
import { useShippingZonesQuery } from "../../shipping/hooks/useShipping";
import { findZoneForState, detectStateFromAddress, allCoveredStates } from "../../shipping/hooks/useShipping";
import { formatPrice } from "../../../lib/format";
import { TRANSFER_DETAILS } from "../transferDetails";

export default function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.list);
  useProductsQuery();
  const summary = useCartSummary();
  const { placeOrder, isPlacing } = usePlaceOrder();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [stateManuallyChosen, setStateManuallyChosen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useProfileQuery();
  const { data: zones = [], isLoading: zonesLoading } = useShippingZonesQuery();

  useEffect(() => {
    if (stateManuallyChosen || !profile?.address || !zones.length) return;
    const detected = detectStateFromAddress(zones, profile.address);
    if (detected) setSelectedState(detected);
  }, [profile?.address, zones, stateManuallyChosen]);

  const matchedZone = useMemo(
    () => (selectedState ? findZoneForState(zones, selectedState) : null),
    [zones, selectedState],
  );
  const coveredStates = useMemo(() => allCoveredStates(zones), [zones]);

  const hasAddress = Boolean(profile?.address && profile.address.trim());
  const deliveryCharge = matchedZone?.rate ?? 0;
  const total = summary.subtotal + deliveryCharge;
  const canPlaceOrder = hasAddress && Boolean(matchedZone) && items.length > 0;

  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Add items to your cart before checking out.");
      return;
    }
    if (!hasAddress) {
      Alert.alert("Address Required", "Add a delivery address in your profile before checking out.");
      return;
    }
    if (!matchedZone) {
      Alert.alert("Delivery Unavailable", "Select a delivery state we currently ship to.");
      return;
    }
    try {
      const order = await placeOrder({
        shipping_address: `${profile?.name ?? ""}\n${profile?.phone ?? ""}\n${profile?.address ?? ""}`.trim(),
        shipping_zone_id: matchedZone.id,
        payment_method: "BANK_TRANSFER",
      });
      navigation.replace("OrderConfirmation", { orderId: String(order.id), amount: total });
    } catch (err: any) {
      Alert.alert("Order Failed", err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.card}>
            {profileLoading ? (
              <ActivityIndicator color="#000" />
            ) : hasAddress ? (
              <>
                <View style={styles.cardRow}>
                  <Ionicons name="location-outline" size={20} color="#333" />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Delivery Address</Text>
                    <Text style={styles.cardText}>{profile?.name}</Text>
                    <Text style={styles.cardText}>{profile?.phone}</Text>
                    <Text style={styles.cardText}>{profile?.address}</Text>
                  </View>
                  <Pressable onPress={() => navigation.navigate("EditProfile")}>
                    <Text style={styles.changeLink}>Edit</Text>
                  </Pressable>
                </View>
                <View style={styles.divider} />
              </>
            ) : (
              <Pressable style={styles.cardRow} onPress={() => navigation.navigate("EditProfile")}>
                <Ionicons name="alert-circle-outline" size={20} color="#e74c3c" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>No delivery address on file</Text>
                  <Text style={[styles.cardText, { color: "#007AFF" }]}>Add one in your profile →</Text>
                </View>
              </Pressable>
            )}

            <View style={styles.cardRow}>
              <Ionicons name="map-outline" size={20} color="#333" />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Delivery State</Text>
                <Text style={styles.cardText}>{selectedState ?? "Not selected"}</Text>
              </View>
              <Pressable onPress={() => setStatePickerOpen(true)} disabled={zonesLoading}>
                <Text style={styles.changeLink}>{selectedState ? "Change" : "Select"}</Text>
              </Pressable>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color="#333" />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Delivery Time</Text>
                <Text style={styles.cardText}>
                  {zonesLoading
                    ? "Loading..."
                    : matchedZone
                      ? matchedZone.deliveryEstimate
                      : selectedState
                        ? "We don't currently deliver to this state"
                        : "Select a delivery state above"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            {cartItems.map((item) => (
              <View key={item.product_id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>₦{formatPrice(item.product.price * item.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{summary.itemCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₦{formatPrice(summary.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>
                {!matchedZone ? "—" : deliveryCharge === 0 ? "FREE" : `₦${formatPrice(deliveryCharge)}`}
              </Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₦{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentLeft}>
                <Ionicons name="business-outline" size={22} color="#333" />
                <Text style={styles.paymentLabel}>Bank Transfer</Text>
              </View>
            </View>
          </View>

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
            <Text style={styles.transferHint}>
              Send the total amount above, then place your order. Your order will be confirmed once payment is received.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>₦{formatPrice(total)}</Text>
        </View>
        <Pressable
          style={[styles.placeOrderButton, (isPlacing || !canPlaceOrder) && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacing || !canPlaceOrder}
        >
          {isPlacing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </Pressable>
      </View>

      <Modal visible={statePickerOpen} animationType="slide" transparent onRequestClose={() => setStatePickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setStatePickerOpen(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Delivery State</Text>
            <FlatList
              data={coveredStates}
              keyExtractor={(s) => s}
              style={{ maxHeight: 360 }}
              renderItem={({ item: state }) => (
                <Pressable
                  style={styles.modalRow}
                  onPress={() => {
                    setSelectedState(state);
                    setStateManuallyChosen(true);
                    setStatePickerOpen(false);
                  }}
                >
                  <Text style={styles.modalRowText}>{state}</Text>
                  {state === selectedState && <Ionicons name="checkmark" size={20} color="#000" />}
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.modalEmpty}>No delivery zones configured yet.</Text>}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  iconBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  scroll: { paddingBottom: 24 },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10, color: "#333" },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardRow: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6,
  },
  cardContent: { flex: 1 },
  cardLabel: { fontSize: 13, fontWeight: "600", color: "#888", marginBottom: 2 },
  cardText: { fontSize: 15, color: "#333" },
  changeLink: { fontSize: 14, fontWeight: "600", color: "#007AFF" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 10 },
  itemRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6,
  },
  itemName: { flex: 1, fontSize: 14, color: "#555" },
  itemQty: { fontSize: 14, color: "#888" },
  itemPrice: { fontSize: 14, fontWeight: "600", color: "#333", minWidth: 60, textAlign: "right" },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", marginTop: 6,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  totalDivider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#000" },
  paymentRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  paymentLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  paymentLabel: { fontSize: 15, color: "#333" },
  transferCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  transferTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 4 },
  transferRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  transferLabel: { fontSize: 13, color: "#888" },
  transferValue: { fontSize: 14, fontWeight: "600", color: "#000" },
  transferHint: { fontSize: 12, color: "#999", marginTop: 6, lineHeight: 17 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#ccc",
    justifyContent: "center", alignItems: "center",
  },
  radioActive: { borderColor: "#000" },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#000" },
  footer: {
    backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f0f0f0",
    paddingHorizontal: 20, paddingVertical: 16, gap: 12,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerTotalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
  footerTotalValue: { fontSize: 18, fontWeight: "700", color: "#000" },
  placeOrderButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#000", borderRadius: 12, paddingVertical: 16,
  },
  placeOrderButtonDisabled: { opacity: 0.6 },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 32 },
  modalTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  modalRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  modalRowText: { fontSize: 15, color: "#333" },
  modalEmpty: { fontSize: 14, color: "#999", paddingVertical: 20, textAlign: "center" },
});
