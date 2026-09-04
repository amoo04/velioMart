import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Payment {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  payment_method: string | null;
  payment_status: string;
  transaction_ref: string | null;
  created_at: string;
}

interface PaymentsState {
  list: Payment[];
  selectedPayment: Payment | null;
}

const initialState: PaymentsState = {
  list: [],
  selectedPayment: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.list = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.list.unshift(action.payload);
    },
    updatePaymentInList: (state, action: PayloadAction<Payment>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
      if (state.selectedPayment?.id === action.payload.id) {
        state.selectedPayment = action.payload;
      }
    },
    setSelectedPayment: (state, action: PayloadAction<Payment | null>) => {
      state.selectedPayment = action.payload;
    },
    clearPayments: () => initialState,
  },
});

export const {
  setPayments,
  addPayment,
  updatePaymentInList,
  setSelectedPayment,
  clearPayments,
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
