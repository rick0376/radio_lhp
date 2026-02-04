"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type Status = {
  live: boolean;
  title?: string;
  streamUrl?: string | null;
};

const AD_NAME = "Henrique Pereira";
const AD_ROLE = "Web & Mobile Applications";
const AD_CONTACT = "WhatsApp: (11) 9 9999-9999";

const STATION_NAME = "Radio Presbiteriana";
const ACCOUNT_NAME = "Á Hora do Milagre";

// Coloque uma imagem em /public/radio-bg.jpg (pode trocar o nome no CSS)
const BG_IMAGE = "/logo.png";
// Opcional: capa pequena do “agora tocando” em /public/radio-cover.jpg
const COVER_IMAGE = "/pastor.png";

export default function OuvirPage() {
  const [status, setStatus] = useState<Status>({
    live: false,
    title: "Oração ao vivo",
    streamUrl: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState<string>("");

  async function load() {
    try {
      const r = await fetch("/api/radio/status", { cache: "no-store" });
      if (!r.ok) return;

      const j = (await r.json()) as Status;

      setStatus((prev) => {
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
      // não derruba o player em erro de rede
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  // Se ficar offline, para o áudio
  useEffect(() => {
    if (!status.live || !status.streamUrl) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setPlayError("");
    }
  }, [status.live, status.streamUrl]);

  async function togglePlay() {
    setPlayError("");

    const a = audioRef.current;
    if (!a) return;

    try {
      if (a.paused) {
        await a.play();
        setIsPlaying(true);
      } else {
        a.pause();
        setIsPlaying(false);
      }
    } catch {
      // Autoplay/permite som depende do navegador (principalmente celular)
      setPlayError("Toque novamente no ▶ para iniciar o áudio.");
      setIsPlaying(false);
    }
  }

  const isLive = !!status.live;
  const hasUrl = !!status.streamUrl;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>{status.title ?? "Rádio LHP"}</h1>

        <div className={styles.statusRow}>
          <span
            className={isLive ? styles.statusLiveText : styles.statusOffText}
          >
            {isLive ? "AO VIVO" : "OFFLINE"}
          </span>
          <span className={isLive ? styles.dotLive : styles.dotOff} />
        </div>

        <section
          className={styles.radioShell}
          style={{ ["--bg" as any]: `url(${BG_IMAGE})` }}
        >
          <div className={styles.bg} aria-hidden="true" />
          <div className={styles.overlay} aria-hidden="true" />

          <div className={styles.inner}>
            <div className={styles.stationRow}>
              <div className={styles.logo} aria-hidden="true" />
              <div className={styles.stationMeta}>
                <div className={styles.accountName}>{ACCOUNT_NAME}</div>

                <div className={styles.badges}>
                  <span className={styles.badgeLive}>
                    <span className={styles.badgeDot} />
                    Live
                  </span>
                  <span className={styles.badgeEvent}>Event</span>
                </div>
              </div>
            </div>

            <div className={styles.nowCard}>
              <div
                className={styles.cover}
                style={{ ["--cover" as any]: `url(${COVER_IMAGE})` }}
                aria-hidden="true"
              />

              <div className={styles.nowMeta}>
                <div className={styles.nowLabel}>
                  {isLive ? "LIVE NOW" : "OFFLINE"}
                </div>
                <div className={styles.nowTitle}>{STATION_NAME}</div>

                <div
                  className={`${styles.wave} ${!isLive ? styles.wavePaused : ""}`}
                  aria-hidden="true"
                >
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                </div>
              </div>

              <button
                type="button"
                className={`${styles.playBtn} ${
                  !isLive || !hasUrl ? styles.playDisabled : ""
                }`}
                onClick={togglePlay}
                disabled={!isLive || !hasUrl}
                aria-label={isPlaying ? "Pausar" : "Ouvir"}
                title={isPlaying ? "Pausar" : "Ouvir"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
            </div>

            {!isLive && (
              <p className={styles.muted}>A transmissão ainda não começou.</p>
            )}

            {isLive && !hasUrl && (
              <p className={styles.muted}>
                Rádio ligada, mas nenhuma URL de áudio foi informada.
              </p>
            )}

            {playError && <p className={styles.error}>{playError}</p>}

            <div className={styles.adBadge}>
              Desenvolvedor: <strong>Rick Pereira</strong> :{" "}
              <a
                className={styles.adLink}
                href="https://wa.me/5512991890682"
                target="_blank"
                rel="noreferrer"
              >
                (12) 9 99189-0682
              </a>
            </div>
          </div>
        </section>

        {/* Áudio real (escondido) */}
        {isLive && hasUrl && (
          <audio
            ref={audioRef}
            src={status.streamUrl ?? undefined}
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </div>
    </main>
  );
}
