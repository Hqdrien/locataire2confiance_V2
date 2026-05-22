import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isTenantRoute = req.nextUrl.pathname.startsWith("/tenant");
        const isLandlordRoute = req.nextUrl.pathname.startsWith("/landlord");
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        if (isTenantRoute && token?.role !== "TENANT") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (isLandlordRoute && token?.role !== "LANDLORD") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (isAdminRoute && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/tenant/:path*", "/landlord/:path*", "/admin/:path*"],
};
