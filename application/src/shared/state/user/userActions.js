import { userSlice } from "./userSlice";

export const { setUser, clearUser, setAuthStatus, setAuthError } =
  userSlice.actions;
