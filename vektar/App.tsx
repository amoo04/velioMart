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

const MIN_SPLASH_TIME = 4000;
// safety net: never block the app forever even if hydration hangs
const MAX_HYDRATE_WAIT = 8000;

function AppContent() {
  const { isHydrating } = useHydrateAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // hand off from the native splash to our animated one immediately,
    // so there's no blank-screen gap between them
    SplashScreen.hideAsync().catch(() => {});

    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_TIME);
    const forceTimer = setTimeout(() => setForceReady(true), MAX_HYDRATE_WAIT);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(forceTimer);
    };
  }, []);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  const authReady = !isHydrating || forceReady;
  const shouldExit = minTimeElapsed && authReady;

  if (!splashDone) {
    return <AnimatedSplash shouldExit={shouldExit} onFinish={handleSplashFinish} />;
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
