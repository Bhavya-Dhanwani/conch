"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const hiddenOnRoutes = new Set(["/login", "/signup", "/create"]);

export default function NavbarGate() {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.overflowY = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
    document.documentElement.classList.remove(
      "lenis",
      "lenis-smooth",
      "lenis-stopped",
      "lenis-scrolling",
    );
    document.body.classList.remove("lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling");
  }, [pathname]);

  if (hiddenOnRoutes.has(pathname) || isDashboardRoute) {
    return null;
  }

  return <Navbar />;
}
