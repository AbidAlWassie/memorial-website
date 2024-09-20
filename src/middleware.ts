// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // check if the user is authorized
        if (token) return true;

        // If there's no token then redirect to signin page
        if (req.nextUrl.pathname !== "/api/auth/signin") {
          return false;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/contribute"],
};
