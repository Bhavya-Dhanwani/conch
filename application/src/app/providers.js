"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { clearUser, setAuthStatus, setUser } from "@/shared/state/user/userActions";
import { createBackendApi } from "@/shared/config/api";

const backendApi = createBackendApi();

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
