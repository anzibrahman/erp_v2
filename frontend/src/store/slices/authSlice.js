import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = Boolean(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
  },
});

export const { setUser, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
