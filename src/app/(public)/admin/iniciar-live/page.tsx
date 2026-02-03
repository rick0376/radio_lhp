"use client";

import styles from "./styles.module.scss";
import { YOUTUBE_CREATE_URL, YOUTUBE_STUDIO_URL } from "@/lib/youtube";

export default function IniciarLivePage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎥 Iniciar Oração Ao Vivo</h1>

        <p className={styles.text}>
          Use os botões abaixo para abrir o YouTube e iniciar a transmissão.
          <br />A live será <strong>gravada automaticamente</strong>.
        </p>

        <div className={styles.actions}>
          <a
            href={YOUTUBE_CREATE_URL}
            target="_blank"
            rel="noreferrer"
            className={styles.btnMobile}
          >
            📱 Abrir YouTube (Celular)
          </a>

          {YOUTUBE_STUDIO_URL && (
            <a
              href={YOUTUBE_STUDIO_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.btnDesktop}
            >
              💻 Abrir YouTube Studio (Computador)
            </a>
          )}
        </div>

        <div className={styles.note}>
          <p>
            👉 Após iniciar a live,
            <br />
            volte ao <strong>Admin Rádio</strong> e clique em{" "}
            <strong>Ligar</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}
