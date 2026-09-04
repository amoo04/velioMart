import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  data: UserProfile | null;
}

const initialState: ProfileState = {
  data: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.data = action.payload;
    },
    clearProfile: (state) => {
      state.data = null;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
