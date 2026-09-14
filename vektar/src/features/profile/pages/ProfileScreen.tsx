import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { useAuth } from "../../../lib/auth-context";
import { useProfileQuery } from "../hooks/useProfile";
import { useOrdersQuery } from "../../orders/hooks/useOrders";
import { Avatar } from "../../../components/Avatar";
import type { RootState } from "../../../store-config/store";
import type { RootStackParamList, TabParamList } from "../../../navigation/types";

const links = [
  {
    icon: "person-outline",
    label: "Personal Info",
    screen: "EditProfile",
  },
  {
    icon: "lock-closed-outline",
    label: "Change Password",
    screen: "Privacy",
  },
  { icon: "card-outline", label: "Payment Methods", screen: "Payments" },
  { icon: "location-outline", label: "Shipping Addresses", screen: "EditProfile" },
  {
    icon: "notifications-outline",
    label: "Notifications",
    screen: "NotificationSettings",
  },
  { icon: "shield-outline", label: "Privacy", screen: "Privacy" },
  {
    icon: "help-circle-outline",
    label: "Help Center",
    screen: "HelpCenter",
  },
] as const;

type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Profile">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, isAuthenticated, signOut } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  useOrdersQuery();

  const ordersCount = useSelector((state: RootState) => state.orders.list.length);
  const wishlistCount = useSelector((state: RootState) => state.cart.wishlist.length);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const displayName = profile?.name ?? user?.name ?? "";
  const displayEmail = profile?.email ?? user?.email ?? "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backBtn} />
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={styles.backBtn}
        >
          <Ionicons name="settings-outline" size={22} color="#000" />
        </Pressable>
      </View>

      {isAuthenticated ? (
        isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
        ) : (
        <>
          <View style={styles.profileCard}>
            <Avatar name={displayName} size={60} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{displayEmail}</Text>
            </View>
            <Pressable onPress={() => navigation.navigate("EditProfile")}>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{ordersCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{wishlistCount}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
          </View>

          <View style={styles.links}>
            {links.map((link) => (
              <Pressable
                key={link.label}
                style={styles.linkRow}
                onPress={() => link.screen && navigation.navigate(link.screen)}
              >
                <View style={styles.linkLeft}>
                  <Ionicons name={link.icon as any} size={20} color="#333" />
                  <Text style={styles.linkLabel}>{link.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.logoutBtn} onPress={handleSignOut}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </>
        )
      ) : (
        <View style={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#ddd" />
          <Text style={styles.guestTitle}>Welcome</Text>
          <Text style={styles.guestSubtitle}>
            Sign in or create an account to manage your profile
          </Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfo: { flex: 1, gap: 2 },
  name: { fontSize: 18, fontWeight: "700" },
  email: { fontSize: 14, color: "#888" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statNumber: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#888" },
  statDivider: { width: 1, backgroundColor: "#eee" },

  links: { backgroundColor: "#fff", marginTop: 16 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  linkLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  linkLabel: { fontSize: 15, color: "#333" },

  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: { fontSize: 15, color: "#e74c3c", fontWeight: "500" },

  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  guestTitle: { fontSize: 24, fontWeight: "700", marginTop: 16 },
  guestSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  secondaryBtnText: { color: "#000", fontSize: 16, fontWeight: "600" },
});
