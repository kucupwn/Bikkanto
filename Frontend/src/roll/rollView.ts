export function toggleRollSettingsOverview(
  settingsContainer: HTMLElement,
  overviewContainer: HTMLElement
): void {
  settingsContainer?.classList.toggle("hidden");
  overviewContainer?.classList.toggle("hidden");
}

export function toggleRollOverviewSubmit(
  overviewTableButtonsContainer: HTMLElement,
  rollSubmitContainer: HTMLElement
): void {
  overviewTableButtonsContainer?.classList.toggle("hidden");
  rollSubmitContainer?.classList.toggle("hidden");
}

export function toggleUnsubmittedRollDisplay(
  pendingRollContainer: HTMLElement | null,
  settingsContainer: HTMLElement | null
): void {
  if (localStorage.getItem("pendingTable")) {
    pendingRollContainer?.classList.remove("hidden");
    settingsContainer?.classList.add("hidden");
  } else {
    pendingRollContainer?.classList.add("hidden");
    settingsContainer?.classList.remove("hidden");
  }
}
