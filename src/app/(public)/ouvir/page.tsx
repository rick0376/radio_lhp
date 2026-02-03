"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type Status = {
  live: boolean;
  title?: string;
  streamUrl?: string | null;
};

export default function OuvirPage() {
  // 🔴 NUNCA começar com null
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
        // 🔴 só atualiza se algo realmente mudou
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
      // 🔴 NÃO altera o estado em erro
    }
  }

  useEffect(() => {
    load(); // primeira vez
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{status.title ?? "Rádio LHP"}</h1>

        {/* AO VIVO */}
        {status.live && status.streamUrl && (
          <>
            <p className={styles.live}>AO VIVO 🔴</p>

            <div className={styles.radioPlayerWrap}>
              <iframe
                className={styles.radioPlayer}
                src={status.streamUrl}
                title="Rádio ao vivo"
                allow="autoplay"
                loading="lazy"
              />
            </div>
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
