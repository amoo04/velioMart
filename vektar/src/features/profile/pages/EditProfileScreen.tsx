import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useProfileQuery } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { Avatar } from "../../../components/Avatar";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { data: profile, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      { name, phone, address },
      {
        onSuccess: () => {
          Alert.alert("Saved", "Profile updated successfully.");
          navigation.goBack();
        },
        onError: (err) => {
          Alert.alert("Error", err instanceof Error ? err.message : "Failed to update profile.");
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
      ) : (
        <>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Avatar name={name} size={80} />
            </View>
            <Pressable
              style={styles.changePhotoButton}
              onPress={() => Alert.alert("Coming Soon", "Photo uploads aren't available yet.")}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={profile?.email ?? ""}
              editable={false}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              multiline
            />
          </View>

          <Pressable
            style={[styles.saveButton, updateProfile.isPending && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </>
      )}
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  changePhotoText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  form: {
    paddingHorizontal: 20,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputDisabled: {
    color: "#999",
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 36,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
