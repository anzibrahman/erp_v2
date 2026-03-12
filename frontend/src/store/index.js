import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import {
  loadAuthFromStorage,
  saveAuthToStorage,
  clearAuthFromStorage,
} from "./localStorage";

const persistedAuth = loadAuthFromStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  preloadedState: persistedAuth ? { auth: persistedAuth } : undefined,
});

store.subscribe(() => {
  const authState = store.getState().auth;

  if (authState?.isLoggedIn && authState?.user) {
    saveAuthToStorage(authState);
    return;
  }

  clearAuthFromStorage();
});
