import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin-radio");

  if (!isAdminPage) return NextResponse.next();

  const isLogged = req.cookies.get("radio_admin")?.value === "1";

  if (!isLogged) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-radio/:path*"],
};
