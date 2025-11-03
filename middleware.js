// NextAuth middleware to protect /admin routes for admin role users only
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// You must set NEXTAUTH_SECRET in your env for NextAuth (used here & in [...nextauth])
export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // If not admin role, can also use: new URL('/403', req.url) or redirect to '/'
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
    // Otherwise allow
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only match if authenticated
      authorized: ({ token }) => !!token,
    },
  }
);

// Exclude /login and /admin/403 from authentication protection
export const config = {
  matcher: ["/admin((?!/login|/403).*)"],
};

// Cookie/secret notes:
// - Use 'NEXTAUTH_SECRET' in .env.local for HS256 JWT and encryption.
// - In production, use HTTPS and secure cookies (see next-auth docs).
