import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 🔓 SEMPRE liberar login
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // 🔒 proteger SOMENTE estas rotas
  const isProtected = path === "/admin" || path.startsWith("/admin-radio");

  if (!isProtected) {
    return NextResponse.next();
  }

  const isLogged = req.cookies.get("radio_admin")?.value === "1";

  if (!isLogged) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 🔴 NÃO use /admin/:path*
export const config = {
  matcher: ["/admin", "/admin-radio/:path*"],
};
