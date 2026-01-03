import { Modal } from "bootstrap";

export function openStatsModal(): void {
  const modalEl = document.getElementById("stats-modal");
  if (!modalEl) return;

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();
}
