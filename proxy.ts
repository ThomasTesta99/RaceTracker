
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const publicRoutes: string[] = [];

const guestOnlyRoutes = [
  "/sign-in",
];

const authFlowRoutes: string[] = [
  "/forgot-password",
  "/reset-password",
  "/email-verified",
  "/email-change-approved",
];

const matchesRoute = (pathname: string, routes: string[]) => {
  return routes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isGuestOnlyRoute = matchesRoute(pathname, guestOnlyRoutes);
  const isAuthFlowRoute = matchesRoute(pathname, authFlowRoutes);

  if (isPublicRoute || isAuthFlowRoute) return NextResponse.next();

  const data = await auth.api.getSession({ headers: req.headers });
  const hasSession = Boolean(data?.session);

  if (hasSession && isGuestOnlyRoute) {
    console.log("[proxy] Redirecting authenticated user:", pathname, "-> /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!hasSession && !isGuestOnlyRoute) {
    console.log("[proxy] Redirecting unauthenticated user:", pathname, "-> /sign-in");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)",
  ],
};
