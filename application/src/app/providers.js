"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { store } from "@/store/store";
import { clearUser, setAuthStatus, setUser } from "@/shared/state/user/userActions";
import { createBackendApi } from "@/shared/config/api";
import { useAppSelector } from "@/store/hooks";

const backendApi = createBackendApi();
const protectedRoutePrefixes = ["/dashboard"];
const authRoutes = new Set(["/login", "/signup"]);

function getCurrentPathWithSearch(pathname) {
  if (typeof window === "undefined") return pathname;

  return `${pathname}${window.location.search || ""}`;
}

function getRedirectTarget() {
  if (typeof window === "undefined") return "/dashboard";

  const nextPath = new URLSearchParams(window.location.search).get("next");
  return nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
}

function AuthRouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, status } = useAppSelector((state) => state.user);
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.has(pathname);
  const isCheckingAuth = status === "idle" || status === "loading";

  useEffect(() => {
    if (isCheckingAuth) return;

    if (isProtectedRoute && !isAuthenticated) {
      const nextPath = encodeURIComponent(getCurrentPathWithSearch(pathname));
      router.replace(`/login?next=${nextPath}`);
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      router.replace(getRedirectTarget());
    }
  }, [isAuthenticated, isAuthRoute, isCheckingAuth, isProtectedRoute, pathname, router]);

  if (isProtectedRoute && isCheckingAuth) {
    return (
      <main className="route-loading-shell" role="status" aria-live="polite">
        <div>
          <span />
          <p>Opening workspace...</p>
        </div>
      </main>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return null;
  }

  if (isAuthRoute && isAuthenticated && !isCheckingAuth) {
    return null;
  }

  return children;
}

export default function Providers({ children }) {
  useEffect(() => {
    let isMounted = true;

    store.dispatch(setAuthStatus("loading"));

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
        store.dispatch(setAuthStatus("failed"));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthRouteGuard>{children}</AuthRouteGuard>
    </Provider>
  );
}
