import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("sessionToken")?.value;
    if (req.nextUrl.pathname.startsWith("/welcome") && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/welcome/:path*", "/welcome"], // only protect /welcome routes
};