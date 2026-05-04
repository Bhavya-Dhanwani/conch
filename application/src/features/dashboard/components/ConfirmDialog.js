"use client";

import styles from "./DeploymentInterface.module.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.confirmOverlay} role="presentation" onMouseDown={onCancel}>
      <section
        className={styles.confirmDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span>Confirm action</span>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{message}</p>
        <div className={styles.confirmActions}>
          <button type="button" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button className={styles.dangerButton} type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
