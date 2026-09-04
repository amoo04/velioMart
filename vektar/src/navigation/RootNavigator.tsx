import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import type { RootState } from "../store-config/store";
import type { RootStackParamList } from "./types";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../features/auth/pages/LoginScreen";
import RegisterScreen from "../features/auth/pages/RegisterScreen";
import CheckoutScreen from "../features/checkout/pages/CheckoutScreen";
import OrderConfirmationScreen from "../features/checkout/pages/OrderConfirmationScreen";
import OrderDetailScreen from "../features/orders/pages/OrderDetailScreen";
import ProductDetailScreen from "../features/Products/pages/ProductDetailScreen";
import SettingsScreen from "../features/profile/pages/SettingsScreen";
import EditProfileScreen from "../features/profile/pages/EditProfileScreen";
import NotificationSettingsScreen from "../features/profile/pages/NotificationSettingsScreen";
import PrivacyScreen from "../features/profile/pages/PrivacyScreen";
import ChangePasswordScreen from "../features/profile/pages/ChangePasswordScreen";
import LanguageScreen from "../features/profile/pages/LanguageScreen";
import HelpCenterScreen from "../features/profile/pages/HelpCenterScreen";
import AboutScreen from "../features/profile/pages/AboutScreen";
import PaymentsScreen from "../features/payments/pages/PaymentsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "Tabs" : "SignIn"}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="SignIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={RegisterScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
    </Stack.Navigator>
  );
}
