"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";

type RadioStatus = {
  live: boolean;
  title?: string;
};

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<RadioStatus | null>(null);

  async function loadStatus() {
    try {
      const r = await fetch("/api/radio/status", { cache: "no-store" });
      const j = (await r.json()) as RadioStatus;
      setStatus(j);
    } catch {
      setStatus({ live: false });
    }
  }

  useEffect(() => {
    loadStatus();
    const id = setInterval(loadStatus, 15000);
    return () => clearInterval(id);
  }, []);

  const isLive = !!status?.live;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>📻 Rádio LHP</h1>

          <span className={isLive ? styles.live : styles.offline}>
            {isLive ? "AO VIVO" : "OFFLINE"}
          </span>
        </header>

        {/* Descrição */}
        <p className={styles.subtitle}>
          {isLive
            ? "A transmissão está ao vivo agora."
            : "Aguarde, a transmissão começará em breve."}
        </p>

        {/* Botão principal (ouvinte) */}
        <button
          type="button"
          className={styles.radioBtn}
          onClick={() => router.push("/ouvir")}
        >
          <span className={styles.radioIcon}>{isLive ? "🔴" : "🔊"}</span>
          <span className={styles.radioText}>
            {isLive ? "Ouvir agora" : "Ouvir Rádio"}
          </span>
          <span className={styles.badge}>
            {isLive ? "Ao vivo" : "Em breve"}
          </span>
        </button>

        {/* Área Admin (discreta e organizada) */}
        <footer className={styles.footer}>
          <Link href="/admin/login" className={styles.adminLink}>
            🔐 Área do Administrador
          </Link>
        </footer>
      </div>
    </main>
  );
}
