import { Modal } from "bootstrap";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { fetchHistoryRange } from "./historyApi";
import { HISTORY_RANGE_URL } from "../api/urls";
import { showFeedback } from "../ribbon/feedbackRibbon";

export function openStatsModal(): void {
  const modalEl = document.getElementById("stats-modal");
  if (!modalEl) return;

  const title = document.getElementById("stats-modal-label");
  if (!title) return;

  title.textContent = "Select history interval";

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  getDatePicker();
  handleRangeSubmitForm(bootstrapModal);
}

function getDatePicker(): void {
  const dateInput = document.getElementById(
    "history-date-picker"
  ) as HTMLInputElement | null;
  if (!dateInput) return;

  flatpickr(dateInput, {
    dateFormat: "Y-m-d",
    mode: "range",
  });
}

function handleRangeSubmitForm(modal: bootstrap.Modal): void {
  const form = document.getElementById("stats-form") as HTMLFormElement | null;
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const range = formData.get("date-range");

    if (!range || typeof range !== "string" || !range.includes(" to ")) {
      showFeedback("Please select a valid date range", "error");
      return;
    }

    const [start_date, end_date] = range.split(" to ");

    await fetchHistoryRange(HISTORY_RANGE_URL, start_date, end_date);

    modal.hide();
    form.reset();
  };
}
