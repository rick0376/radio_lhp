import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key || key !== process.env.RADIO_ADMIN_KEY) {
      return NextResponse.json({ error: "Chave inválida" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("radio_admin", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
      sameSite: "lax",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
