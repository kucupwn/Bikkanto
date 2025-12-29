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

export function togglePendingRollOptions(
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

export function toggleUnsubmittedRollDisplay(
  overviewContainer: HTMLElement | null,
  overviewTableButtonsContainer: HTMLElement | null,
  rollSubmitContainer: HTMLElement | null,
  pendingRollContainer: HTMLElement | null
): void {
  overviewContainer?.classList.remove("hidden");
  overviewTableButtonsContainer?.classList.add("hidden");
  rollSubmitContainer?.classList.remove("hidden");
  pendingRollContainer?.classList.add("hidden");
}

export function toggleFinishedWorkoutDisplay(
  overviewContainer: HTMLElement | null,
  finishedRollContainer: HTMLElement | null
): void {
  overviewContainer?.classList.add("hidden");
  finishedRollContainer?.classList.remove("hidden");
}
