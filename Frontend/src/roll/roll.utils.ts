import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import type { RollCallbacks } from "../types/roll.types";

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
      await callback.onSaveWorkoutHistory();
      localStorage.removeItem("pendingTable");
      finishRollButton.disabled = false;
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

export function createCategorySelections(
  count: number,
  categories: string[],
  container: HTMLDivElement
): void {
  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.classList = "exercise-row";

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.classList = "exercise-label";

    const select = document.createElement("select");
    select.id = `exercise-select-${i}`;
    select.classList = "form-select";
    select.style = "width: auto";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- Select --";
    select.appendChild(option);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.toUpperCase();
      select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);

    container.appendChild(row);
  }
}

export function getSelectedCategories(): string[] {
  const container = document.getElementById("exercise-categories-container");
  if (!container) return [];

  const selectElements = container.querySelectorAll("select");

  const categorySelections: string[] = [];

  selectElements.forEach((ex) => {
    const value = (ex as HTMLSelectElement).value;
    if (value) {
      categorySelections.push(value);
    }
  });

  return categorySelections;
}

export function getRandomExercise(
  exercises: Exercises[],
  category: string,
  difficulty: string
): WorkoutEntry {
  const filtered = exercises.filter((ex) => ex.category === category);

  if (filtered.length === 0) {
    return {
      category: "No exercise found",
      exercise: "No exercise found",
      reps: 0,
    };
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const exercise = filtered[idx];

  const minKey = `${difficulty}_min` as keyof Exercises;
  const maxKey = `${difficulty}_max` as keyof Exercises;

  const minRep = exercise[minKey] as number;
  const maxRep = exercise[maxKey] as number;

  const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

  return {
    category: exercise.category,
    exercise: exercise.exercise_name,
    reps,
  };
}
