import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please Enter Email and Password");
      return;
    }
    mutate(
      { email, password },
      {
        onSuccess: () => {
          Alert.alert("Success", "Login Successful");
          navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
        },
        onError: (err) => {
          Alert.alert("Login Failed", err instanceof Error ? err.message : "Something went wrong.");
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.primaryBtn, isPending && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.replace("SignUp")} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              Don&apos;t have an account?{" "}
              <Text style={styles.switchTextBold}>Create Account</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 12, paddingVertical: 8 },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#888", marginBottom: 32 },
  form: { gap: 20 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: "#000",
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  eyeBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  primaryBtn: {
    backgroundColor: "#000", borderRadius: 12, paddingVertical: 16,
    alignItems: "center", marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  switchBtn: { alignItems: "center", marginTop: 4 },
  switchText: { fontSize: 14, color: "#888" },
  switchTextBold: { color: "#000", fontWeight: "600" },
});
