import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderRow {
  id: number;
  user_id: number;
  total_amount: number;
  delivery_fee: number;
  payment_status: string;
  delivery_status: string;
  transaction_ref: string | null;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order extends OrderRow {
  items: OrderItem[];
}

interface OrdersState {
  list: Order[];
  selectedOrder: Order | null;
}

const initialState: OrdersState = {
  list: [],
  selectedOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.list = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.list.unshift(action.payload);
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    updateOrderInList: (state, action: PayloadAction<OrderRow>) => {
      const index = state.list.findIndex((o) => o.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = { ...state.selectedOrder, ...action.payload };
      }
    },
    clearOrders: () => initialState,
  },
});

export const {
  setOrders,
  addOrder,
  setSelectedOrder,
  updateOrderInList,
  clearOrders,
} = ordersSlice.actions;
export default ordersSlice.reducer;
