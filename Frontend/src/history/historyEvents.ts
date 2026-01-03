import type { HistoryCallbacks } from "../types/history.types";

export function attachHistoryEventListeners(callback: HistoryCallbacks): void {
  const historyStatsButton = document.getElementById(
    "btn-stat"
  ) as HTMLButtonElement;
  if (historyStatsButton)
    historyStatsButton.addEventListener("click", () => {
      callback.onOpenStats();
    });
}
