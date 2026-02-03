"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function AdminDashboardPage() {
  const router = useRouter();
  // proteção simples (client-side)
  useEffect(() => {
    const key = localStorage.getItem("radio_admin_key");
    if (!key) {
      router.replace("/admin/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("radio_admin_key");
    router.replace("/");
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔐 Painel Administrativo</h1>

        <p className={styles.subtitle}>Escolha o que deseja fazer:</p>

        <div className={styles.actions}>
          <Link href="/admin-radio" className={styles.actionBtn}>
            📻 Controlar Rádio
            <span>Ligar / Desligar transmissão</span>
          </Link>

          <Link href="/admin/iniciar-live" className={styles.actionBtnAlt}>
            🎥 Iniciar Live
            <span>Abrir YouTube para transmissão</span>
          </Link>
        </div>

        <button className={styles.logout} onClick={logout}>
          Sair
        </button>
      </div>
    </main>
  );
}
