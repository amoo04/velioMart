import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Home: undefined;
  Products: { categoryId?: string } | undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  SignIn: undefined;
  SignUp: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderDetail: { id: string };
  ProductDetail: { id: string };
  Settings: undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
  Privacy: undefined;
  ChangePassword: undefined;
  Language: undefined;
  HelpCenter: undefined;
  About: undefined;
  Payments: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
