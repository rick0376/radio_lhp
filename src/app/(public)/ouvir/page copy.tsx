"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type Status = {
  live: boolean;
  title?: string;
  streamUrl?: string | null;
};

export default function OuvirPage() {
  // 🔴 nunca começar com null
  const [status, setStatus] = useState<Status>({
    live: false,
    title: "Rádio LHP",
    streamUrl: null,
  });

  async function load() {
    try {
      const r = await fetch("/api/radio/status", { cache: "no-store" });
      if (!r.ok) return;

      const j = (await r.json()) as Status;

      setStatus((prev) => {
        // só atualiza se algo mudou
        if (
          prev.live !== j.live ||
          prev.streamUrl !== j.streamUrl ||
          prev.title !== j.title
        ) {
          return j;
        }
        return prev;
      });
    } catch {
      // ❌ não altera estado em erro (não derruba o áudio)
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{status.title ?? "Rádio LHP"}</h1>

        {/* AO VIVO COM ÁUDIO */}
        {status.live && status.streamUrl && (
          <>
            <p className={styles.live}>AO VIVO 🔴</p>

            <audio
              className={styles.audio}
              controls
              autoPlay
              src={status.streamUrl}
            >
              Seu navegador não suporta áudio.
            </audio>
          </>
        )}

        {/* AO VIVO SEM URL */}
        {status.live && !status.streamUrl && (
          <>
            <p className={styles.live}>AO VIVO 🔴</p>
            <p className={styles.muted}>
              Rádio ligada, mas nenhuma URL de áudio foi informada.
            </p>
          </>
        )}

        {/* OFFLINE */}
        {!status.live && (
          <>
            <p className={styles.off}>OFFLINE</p>
            <p className={styles.muted}>A transmissão ainda não começou.</p>
          </>
        )}
      </div>
    </main>
  );
}
