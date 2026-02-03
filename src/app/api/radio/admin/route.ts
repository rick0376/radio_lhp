export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma, ensureRadioRow } from "@/lib/radioDb";

export async function POST(req: Request) {
  try {
    const { key, live, streamUrl } = await req.json(); // Aqui pegamos a URL também

    if (!key || key !== process.env.RADIO_ADMIN_KEY) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await ensureRadioRow();

    // Garantir que estamos atualizando a URL corretamente
    const row = await prisma.radioStatus.update({
      where: { id: "main" },
      data: {
        live: !!live,
        streamUrl: streamUrl ? streamUrl : null, // Atualiza streamUrl
      },
    });

    return NextResponse.json({
      ok: true,
      live: row.live,
      streamUrl: row.streamUrl, // Retorna a URL do stream
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno", details: error },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key || key !== process.env.RADIO_ADMIN_KEY) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  await ensureRadioRow();

  const row = await prisma.radioStatus.findUnique({
    where: { id: "main" },
  });

  return NextResponse.json({
    live: !!row?.live,
    streamUrl: row?.streamUrl ?? null, // Retorna o streamUrl
    updatedAt: row?.updatedAt?.toISOString() ?? new Date().toISOString(),
  });
}
