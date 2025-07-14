import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  // Check if this is an API route that requires authentication
  const { pathname } = request.nextUrl;

  // Protected API routes
  const protectedApiRoutes = [
    "/api/profile",
    "/api/upload",
    "/api/vcard",
    "/api/profile/contact-fields",
  ];

  // Protected pages
  const protectedPages = ["/profile", "/profile-view"];

  const isProtectedApiRoute = protectedApiRoutes.some(
    (route) =>
      pathname.startsWith(route) && pathname !== "/api/profile/[identifier]",
  );

  const isProtectedPage = protectedPages.some((page) =>
    pathname.startsWith(page),
  );

  // Skip authentication for public routes
  if (!isProtectedApiRoute && !isProtectedPage) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    } else {
      // Redirect to login page for protected pages
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Verify token
  const user = verifyToken(token);
  if (!user) {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } else {
      // Redirect to login page for protected pages
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Add user info to headers for API routes
  if (isProtectedApiRoute) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/profile/:path*", "/profile-view/:path*"],
};
