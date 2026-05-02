"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import axios from "axios";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store } from "@/store/store";
import { clearUser, setAuthStatus, setUser } from "@/shared/state/user/userActions";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.1,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
