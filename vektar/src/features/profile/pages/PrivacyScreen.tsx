import { useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";

export default function PrivacyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.section}>
        <Pressable style={styles.row} onPress={() => navigation.navigate("ChangePassword")}>
          <View style={styles.rowLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
            <Text style={styles.rowLabel}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </Pressable>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="finger-print" size={22} color="#333" />
            <Text style={styles.rowLabel}>Biometric Login</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: "#ddd", true: "#000" }}
            thumbColor="#fff"
          />
        </View>

        <Pressable style={[styles.row, styles.rowLast]}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#333" />
            <Text style={styles.rowLabel}>Manage Data Permissions</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
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
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: "#333",
  },
});
