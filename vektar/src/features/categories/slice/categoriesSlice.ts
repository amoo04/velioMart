import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesState {
  list: Category[];
  selectedCategory: Category | null;
}

const initialState: CategoriesState = {
  list: [],
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.list = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.list.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.list.findIndex((c) => c.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearCategories: () => initialState,
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setSelectedCategory,
  clearCategories,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
