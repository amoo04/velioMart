import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./src/store-config/store";
import { queryClient } from "./src/lib/query-client";
import { AuthProvider } from "./src/lib/auth-context";
import { useHydrateAuth } from "./src/features/auth/hooks/useHydrateAuth";
import RootNavigator from "./src/navigation/RootNavigator";
import AnimatedSplash from "./src/components/AnimatedSplash";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { isHydrating } = useHydrateAuth();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  useEffect(() => {
    // hand off from the native splash to our animated one immediately,
    // so there's no blank-screen gap between them
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  if (showAnimatedSplash || isHydrating) {
    return <AnimatedSplash onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
