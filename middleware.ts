import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ sempre liberar a tela de login (senão vira loop)
  if (path.startsWith("/admin/login")) return NextResponse.next();

  const isProtected =
    path.startsWith("/admin") || path.startsWith("/admin-radio");

  if (!isProtected) return NextResponse.next();

  const isLogged = req.cookies.get("radio_admin")?.value === "1";

  if (!isLogged) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-radio/:path*"],
};
