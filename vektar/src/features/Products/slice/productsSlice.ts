import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number | null;
  image_url: string | null;
  brand: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProductsState {
  list: Product[];
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  list: [],
  selectedProduct: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.list.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearProducts: () => initialState,
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setSelectedProduct,
  clearProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
