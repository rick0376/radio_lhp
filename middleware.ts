import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ NUNCA proteger a tela de login
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // proteger APENAS estas rotas
  const isProtected =
    path === "/admin" ||
    path.startsWith("/admin-radio") ||
    path.startsWith("/admin/");

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

// 🔴 matcher NÃO pode incluir /admin/login
export const config = {
  matcher: ["/admin", "/admin-radio/:path*", "/admin/:path*"],
};
