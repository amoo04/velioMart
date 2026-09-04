import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// expo-secure-store has no native module on web (its web build is a no-op
// stub), so use AsyncStorage there instead — it already falls back to
// localStorage on web.
const tokenStore = Platform.OS === "web"
  ? {
      getItemAsync: (key: string) => AsyncStorage.getItem(key),
      setItemAsync: (key: string, value: string) => AsyncStorage.setItem(key, value),
      deleteItemAsync: (key: string) => AsyncStorage.removeItem(key),
    }
  : SecureStore;

export interface StoredUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

export const storage = {
  async getToken(): Promise<string | null> {
    try {
      return await tokenStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await tokenStore.setItemAsync(TOKEN_KEY, token);
    } catch {
      // storage unavailable on this platform/runtime; auth state still
      // works for the current session via Redux, just won't persist
    }
  },

  async removeToken(): Promise<void> {
    try {
      await tokenStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // nothing to clean up if storage was never accessible
    }
  },

  async getUser(): Promise<StoredUser | null> {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: StoredUser): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },
};
