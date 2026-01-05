import { Modal } from "bootstrap";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export function openStatsModal(): void {
  const modalEl = document.getElementById("stats-modal");
  if (!modalEl) return;

  const title = document.getElementById("stats-modal-label");
  if (!title) return;

  title.textContent = "Select history interval";

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  getDatePicker();
}

function getDatePicker(): void {
  const dateInput = document.getElementById("history-date-picker");
  if (!dateInput) return;

  flatpickr(dateInput, {
    dateFormat: "Y-m-d",
    mode: "range",
    onChange: (_, dateStr) => {
      console.log(dateStr);
    },
  });
}
