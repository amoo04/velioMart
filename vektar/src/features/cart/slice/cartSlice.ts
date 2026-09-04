import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
}

interface CartState {
  items: CartItem[];
  wishlist: number[];
}

const initialState: CartState = {
  items: [],
  wishlist: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    upsertCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(
        (item) => item.product_id === action.payload.product_id,
      );
      if (index >= 0) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.wishlist = action.payload;
    },
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const index = state.wishlist.indexOf(action.payload);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(action.payload);
      }
    },
  },
});

export const {
  setCart,
  upsertCartItem,
  removeFromCart,
  clearCart,
  setWishlist,
  toggleWishlist,
} = cartSlice.actions;
export default cartSlice.reducer;
