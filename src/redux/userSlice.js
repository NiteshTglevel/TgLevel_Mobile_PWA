import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    name: "Guest User",
    email: "",
    gender: "",
    dob: "",
    avatar: "",
    userType: "free",
    daysLeft: 5,
    isNewUser: true,
    hasCompletedOnboarding: false,
  },
  unreadNotifications: 0,
  isLoading: true, // 🟢 FIX: Shuru mein isko true rakhenge
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
      state.isLoading = false; // 🟢 FIX: Data aate hi loading ko false kar denge
    },
    toggleUserMode: (state) => {
      state.userData.userType = state.userData.userType === "premium" ? "free" : "premium";
    },
    clearNotifications: (state) => {
      state.unreadNotifications = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // 🟢 FIX: Loading control karne ke liye reducer
    }
  }
});

export const { updateProfile, toggleUserMode, clearNotifications, setLoading } = userSlice.actions;
export default userSlice.reducer;