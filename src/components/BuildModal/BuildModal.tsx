"use client";

import styles from "./styles.module.scss";

export default function BuildModal({
  open,
  title = "Em construção",
  message,
  onClose,
}: {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>🚧</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{message}</p>

        <button className={styles.btn} type="button" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
}
