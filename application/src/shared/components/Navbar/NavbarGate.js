"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const hiddenOnRoutes = new Set(["/login", "/signup"]);

export default function NavbarGate() {
  const pathname = usePathname();

  if (hiddenOnRoutes.has(pathname)) {
    return null;
  }

  return <Navbar />;
}
