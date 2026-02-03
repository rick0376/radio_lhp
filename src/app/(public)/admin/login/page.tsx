"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();

  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("radio_admin_key");
    if (saved) setKey(saved);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const k = key.trim();

      if (!k) {
        setError("Digite a chave.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/radio/admin?key=${encodeURIComponent(k)}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setError("Chave inválida.");
        setLoading(false);
        return;
      }

      localStorage.setItem("radio_admin_key", k);

      // ✅ vai para o dashboard
      router.replace("/admin");
    } catch {
      setError("Falha de conexão.");
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>🔐 Admin Rádio</h1>
          <Link href="/" className={styles.backLink}>
            ← Voltar
          </Link>
        </div>

        <label className={styles.label}>Chave de acesso</label>

        <div className={styles.inputWrap}>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Chave admin (RADIO_ADMIN_KEY)"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
            type={showKey ? "text" : "password"}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
          />

          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowKey((v) => !v)}
            disabled={loading}
            aria-label={showKey ? "Ocultar chave" : "Mostrar chave"}
            title={showKey ? "Ocultar" : "Mostrar"}
          >
            {showKey ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className={styles.hint}>
          Dica: depois do login você verá o painel com acesso ao{" "}
          <strong>Controle da Rádio</strong> e <strong>Iniciar Live</strong>.
        </p>
      </form>
    </main>
  );
}
