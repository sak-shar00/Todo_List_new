import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: "", isLoggedIn: false }, // ✅ fixed typo
  reducers: {
    login(state){
        state.isLoggedIn=true;
    },
    logout(state){
        state.isLoggedIn=false;
    }
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: authSlice.reducer,
});
