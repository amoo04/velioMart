import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../orders/slice/ordersSlice";

interface CheckoutState {
  currentOrder: Order | null;
}

const initialState: CheckoutState = {
  currentOrder: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearCheckout: () => initialState,
  },
});

export const { setCurrentOrder, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
