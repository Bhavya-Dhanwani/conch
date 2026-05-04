"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "@/store/store";
import { clearUser, setAuthStatus, setUser } from "@/shared/state/user/userActions";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
});

export default function Providers({ children }) {
  useEffect(() => {
    let isMounted = true;

    backendApi
      .get("/api/auth/me")
      .then(({ data }) => {
        if (!isMounted) {
          return;
        }

        store.dispatch(setUser(data.user || null));
        store.dispatch(setAuthStatus("succeeded"));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        store.dispatch(clearUser());
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
