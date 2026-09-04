import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";

const menuItems = [
  { icon: "notifications-outline", label: "Notifications", screen: "NotificationSettings" },
  { icon: "globe-outline", label: "Language", screen: "Language", value: "English" },
  { icon: "shield-outline", label: "Privacy", screen: "Privacy" },
  { icon: "help-circle-outline", label: "Help Center", screen: "HelpCenter" },
  { icon: "information-circle-outline", label: "About Us", screen: "About" },
] as const;

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.screen}
            style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={22} color="#333" />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {"value" in item && item.value ? (
                <Text style={styles.menuItemValue}>{item.value}</Text>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", textAlign: "center", marginRight: 40 },
  scrollContent: { paddingBottom: 40, marginTop: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemLabel: { fontSize: 16, color: "#333" },
  menuItemRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuItemValue: { fontSize: 14, color: "#999" },
});
