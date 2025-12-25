import { type RollCallbacks } from "../types/roll.types";

export function attachRollEventListeners(callback: RollCallbacks): void {
  const exerciseCountInput = document.getElementById(
    "exercise-count-input"
  ) as HTMLInputElement;
  if (exerciseCountInput)
    exerciseCountInput.addEventListener("change", () => {
      const exerciseCount = Number(exerciseCountInput.value);
      callback.onGetExerciseSelections(exerciseCount);
    });

  const getButton = document.getElementById("btn-get") as HTMLButtonElement;
  if (getButton)
    getButton.addEventListener("click", () => {
      const workout = callback.onGetWorkout();
      callback.onFillOverviewTable(workout);
      callback.onToggleRollSettingsOverview();
      localStorage.removeItem("pendingTable");
    });

  const restartRollButton = document.getElementById(
    "btn-restart-roll"
  ) as HTMLButtonElement;
  if (restartRollButton)
    restartRollButton.addEventListener("click", () => {
      callback.onToggleRollSettingsOverview();
    });

  const applyRollButton = document.getElementById(
    "btn-apply-roll"
  ) as HTMLButtonElement;
  if (applyRollButton)
    applyRollButton.addEventListener("click", () => {
      callback.onToggleRollOverviewSubmit();
      callback.onApplyRoll();
    });

  const finishRollButton = document.getElementById(
    "btn-finish-roll"
  ) as HTMLButtonElement;
  if (finishRollButton)
    finishRollButton.addEventListener("click", async () => {
      finishRollButton.disabled = true;
      try {
        await callback.onSaveWorkoutHistory();
        localStorage.removeItem("pendingTable");
      } finally {
        finishRollButton.disabled = false;
      }
    });

  const discardButton = document.getElementById(
    "discard-roll"
  ) as HTMLButtonElement;
  if (discardButton)
    discardButton.addEventListener("click", () => {
      localStorage.removeItem("pendingTable");
      callback.onToggleUnsubmittedRollDisplay();
    });

  const loadButton = document.getElementById("load-roll") as HTMLButtonElement;
  if (loadButton)
    loadButton.addEventListener("click", () => {
      callback.onLoadUnsubmittedTable();
    });
}
