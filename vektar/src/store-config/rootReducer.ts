import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import cartReducer from "../features/cart/slice/cartSlice";
import categoriesReducer from "../features/categories/slice/categoriesSlice";
import checkoutReducer from "../features/checkout/slice/checkoutSlice";
import notificationsReducer from "../features/notifications/slice/notificationsSlice";
import ordersReducer from "../features/orders/slice/ordersSlice";
import paymentsReducer from "../features/payments/slice/paymentsSlice";
import productsReducer from "../features/Products/slice/productsSlice";
import profileReducer from "../features/profile/slice/profileSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  checkout: checkoutReducer,
  notifications: notificationsReducer,
  orders: ordersReducer,
  payments: paymentsReducer,
  products: productsReducer,
  profile: profileReducer,
});

export default rootReducer;
