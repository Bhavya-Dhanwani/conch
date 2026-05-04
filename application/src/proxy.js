import { NextResponse } from "next/server";

const protectedRoutePrefixes = ["/dashboard"];
const authRoutes = new Set(["/login", "/signup"]);

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get("token")?.value);
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.has(pathname);

  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    loginUrl.search = loginUrl.search.replace(/%2F/g, "/");
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasToken) {
    const nextPath = request.nextUrl.searchParams.get("next");
    const destination =
      nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
