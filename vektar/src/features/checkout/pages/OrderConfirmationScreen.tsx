import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";

export default function OrderConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderId } = useRoute<RouteProp<RootStackParamList, "OrderConfirmation">>().params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Order Confirmed</Text>
        {orderId && <Text style={styles.orderNumber}>Order #{orderId}</Text>}
        <Text style={styles.subtitle}>We&apos;ll notify you once your order ships.</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            orderId
              ? navigation.replace("OrderDetail", { id: orderId })
              : navigation.replace("Tabs", { screen: "Orders" })
          }
        >
          <Ionicons name="location-outline" size={20} color="#fff" />
          <Text style={styles.primaryText}>Track Order</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  orderNumber: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
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
