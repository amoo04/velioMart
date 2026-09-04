import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const items = [
  { icon: "information-circle-outline", label: "App Version", value: "1.0.0" },
  { icon: "business-outline", label: "Company Information" },
  { icon: "document-text-outline", label: "Terms & Conditions" },
  { icon: "shield-outline", label: "Privacy Policy" },
];

export default function AboutScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            style={styles.row}
           
          >
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={22} color="#333" />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <View style={styles.rowRight}>
              {"value" in item && item.value ? (
                <Text style={styles.rowValue}>{item.value}</Text>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </Pressable>
        ))}
      </View>
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
  list: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowLabel: {
    fontSize: 16,
    color: "#333",
  },
  rowValue: {
    fontSize: 14,
    color: "#999",
  },
});
