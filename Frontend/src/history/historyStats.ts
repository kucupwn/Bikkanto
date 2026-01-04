import { Modal } from "bootstrap";

export function openStatsModal(): void {
  const modalEl = document.getElementById("stats-modal");
  if (!modalEl) return;

  const title = document.getElementById("stats-modal-label");
  if (!title) return;

  title.textContent = "Select history interval";

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();
}
