import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import {
  createCategorySelections,
  getRandomExercise,
  getSelectedCategories,
} from "./roll.utils";

import {
  fetchCategories,
  fetchAllExercises,
} from "../exercises/exercises.utils";

const getButton = document.getElementById("btn-get") as HTMLButtonElement;
const exerciseCountInput = document.getElementById(
  "exercise-count-input"
) as HTMLInputElement;
const restartRollButton = document.getElementById("btn-restart-roll");
const applyRollButton = document.getElementById("btn-apply-roll");
const overviewTableButtons = document.getElementById(
  "roll-table-buttons-container"
);
const rollSubmitContainer = document.getElementById("roll-submit-container");
const settingsContainer = document.getElementById("settings-container");
const overviewContainer = document.getElementById("overview-container");

export class Roll {
  private allExercises: Exercises[] = [];

  constructor() {
    this.attachEventListeners();
  }

  public async init() {
    try {
      this.allExercises = await fetchAllExercises();
    } catch (err) {
      console.log("Error fetching exercises:", err);
    }
  }

  private attachEventListeners() {
    const addBtn = document.getElementById(
      "add-count"
    ) as HTMLButtonElement | null;
    if (addBtn) addBtn.addEventListener("click", () => "");

    const getBtn = document.getElementById(
      "btn-get"
    ) as HTMLButtonElement | null;
    if (getBtn) getBtn.addEventListener("click", () => "");
  }

  public async getExerciseSelections(count: number) {
    const container = document.getElementById(
      "exercise-categories-container"
    ) as HTMLDivElement;
    if (!container) return;

    const categories = await fetchCategories();

    container.innerHTML = "";

    createCategorySelections(count, categories, container);
  }

  public getWorkout(): WorkoutEntry[] {
    const difficulty = (
      document.getElementById("exercise-difficulty") as HTMLSelectElement
    ).value;
    const selectedCategories = getSelectedCategories();
    const workout = selectedCategories?.map((category) => {
      return getRandomExercise(this.allExercises, category, difficulty);
    });

    return workout;
  }

  public fillOverviewTable(workout: WorkoutEntry[]) {
    const table = document.getElementById("overview-table") as HTMLTableElement;
    if (!table) return;

    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    workout.forEach((entry) => {
      const row = document.createElement("tr");

      const exerciseCell = document.createElement("td");
      exerciseCell.textContent = entry.exercise;

      const repsCell = document.createElement("td");
      repsCell.textContent = entry.reps.toString();

      row.appendChild(exerciseCell);
      row.appendChild(repsCell);
      tbody.appendChild(row);
    });
  }
}

const roll = new Roll();
await roll.init();

exerciseCountInput.addEventListener("change", () => {
  const exerciseCount = Number(exerciseCountInput.value);
  roll.getExerciseSelections(exerciseCount);
});

getButton?.addEventListener("click", () => {
  const workout = roll.getWorkout();
  roll.fillOverviewTable(workout);

  settingsContainer?.classList.toggle("hidden");
  overviewContainer?.classList.toggle("hidden");
});

restartRollButton?.addEventListener("click", () => {
  settingsContainer?.classList.toggle("hidden");
  overviewContainer?.classList.toggle("hidden");
});

applyRollButton?.addEventListener("click", () => {
  overviewTableButtons?.classList.toggle("hidden");
  rollSubmitContainer?.classList.toggle("hidden");
});
