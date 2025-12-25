import { toggleUnsubmittedRollDisplay } from "./rollView";

export function loadUnsubmittedTable(
  overviewContainer: HTMLElement | null,
  overviewTableButtonsContainer: HTMLElement | null,
  rollSubmitContainer: HTMLElement | null,
  pendingRollContainer: HTMLElement | null
): void {
  const table = localStorage.getItem("pendingTable");

  if (table) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table, "text/html");
    const tbody = doc.querySelector("tbody");
    const actualTBody = overviewContainer?.querySelector("tbody");

    if (tbody && actualTBody) {
      actualTBody.innerHTML = tbody.innerHTML;
    }

    toggleUnsubmittedRollDisplay(
      overviewContainer,
      overviewTableButtonsContainer,
      rollSubmitContainer,
      pendingRollContainer
    );
  }
}
