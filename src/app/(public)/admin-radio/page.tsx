"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type Status = { live: boolean; streamUrl?: string; updatedAt?: string };

export default function AdminRadioPage() {
  const [key, setKey] = useState("lhp123");
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  async function load() {
    if (!key) return;
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch(`/api/radio/admin?key=${encodeURIComponent(key)}`, {
        cache: "no-store",
      });
      const j = await r.json();
      if (!r.ok) {
        setMsg(j?.error || "Erro ao carregar");
        setStatus(null);
        return;
      }
      setStatus(j);
      setStreamUrl(j.streamUrl ?? ""); // Atualiza a URL do stream
    } catch {
      setMsg("Falha de conexão");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  async function setLive(live: boolean) {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/radio/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, live, streamUrl }), // Envia a URL junto com o status de live
      });
      const j = await r.json();
      if (!r.ok) {
        setMsg(j?.error || "Não autorizado");
        return;
      }
      setStatus({
        live: j.live,
        streamUrl: j.streamUrl,
        updatedAt: j.updatedAt,
      });
      setMsg(live ? "Rádio ligada ✅" : "Rádio desligada ✅");
    } catch {
      setMsg("Falha de conexão");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("radio_admin_key");
    if (saved) setKey(saved);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Rádio</h1>

        <input
          className={styles.input}
          placeholder="Chave admin (RADIO_ADMIN_KEY)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={loading}
        />

        <input
          className={styles.input}
          placeholder="URL do áudio (Mixlr)"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          disabled={loading}
        />

        <div className={styles.row}>
          <button className={styles.btn} onClick={load} disabled={loading}>
            Ver status
          </button>

          <button
            className={styles.btnGreen}
            onClick={() => setLive(true)}
            disabled={loading}
          >
            Ligar
          </button>

          <button
            className={styles.btnRed}
            onClick={() => setLive(false)}
            disabled={loading}
          >
            Desligar
          </button>
        </div>

        <div className={styles.status}>
          <span>Status:</span>{" "}
          <strong className={status?.live ? styles.live : styles.offline}>
            {status ? (status.live ? "AO VIVO" : "OFFLINE") : "—"}
          </strong>
        </div>

        {msg && <div className={styles.msg}>{msg}</div>}
      </div>
    </main>
  );
}
