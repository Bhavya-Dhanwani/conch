import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/shared/state/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
