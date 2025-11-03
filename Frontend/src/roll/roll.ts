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

const overviewTableButtons = document.getElementById(
  "roll-table-buttons-container"
);
const rollSubmitContainer = document.getElementById("roll-submit-container");
const settingsContainer = document.getElementById("settings-container");
const overviewContainer = document.getElementById("overview-container");

export class Roll {
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrlExercises = "http://127.0.0.1:8000/exercises";
  private readonly apiUrlHistory = "http://127.0.0.1:8000/history";

  constructor() {
    this.attachEventListeners();
  }

  public async init() {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrlExercises);
      this.allCategories = await fetchCategories(
        `${this.apiUrlExercises}/categories`
      );
    } catch (err) {
      console.log("Error fetching exercises:", err);
    }
  }

  private attachEventListeners() {
    const exerciseCountInput = document.getElementById(
      "exercise-count-input"
    ) as HTMLInputElement;
    if (exerciseCountInput)
      exerciseCountInput.addEventListener("change", () => {
        const exerciseCount = Number(exerciseCountInput.value);
        this.getExerciseSelections(exerciseCount);
      });

    const getButton = document.getElementById("btn-get") as HTMLButtonElement;
    if (getButton)
      getButton.addEventListener("click", () => {
        const workout = roll.getWorkout();
        roll.fillOverviewTable(workout);

        settingsContainer?.classList.toggle("hidden");
        overviewContainer?.classList.toggle("hidden");
      });

    const restartRollButton = document.getElementById(
      "btn-restart-roll"
    ) as HTMLButtonElement;
    if (restartRollButton)
      restartRollButton.addEventListener("click", () => {
        settingsContainer?.classList.toggle("hidden");
        overviewContainer?.classList.toggle("hidden");
      });

    const applyRollButton = document.getElementById(
      "btn-apply-roll"
    ) as HTMLButtonElement;
    if (applyRollButton)
      applyRollButton.addEventListener("click", () => {
        overviewTableButtons?.classList.toggle("hidden");
        rollSubmitContainer?.classList.toggle("hidden");
      });

    const finishRollButton = document.getElementById(
      "btn-finish-roll"
    ) as HTMLButtonElement;
    if (finishRollButton)
      finishRollButton.addEventListener("click", async () => {
        finishRollButton.disabled = true;
        await this.saveWorkoutHistory();
        finishRollButton.disabled = false;
      });
  }

  public async getExerciseSelections(count: number) {
    const container = document.getElementById(
      "exercise-categories-container"
    ) as HTMLDivElement;
    if (!container) return;
    container.innerHTML = "";

    createCategorySelections(count, this.allCategories, container);
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

  private async saveWorkoutHistory() {
    const table = document.getElementById("overview-table") as HTMLTableElement;
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");

    const today = new Date().toISOString().split("T")[0];

    const cyclesInput = document.getElementById(
      "cycles-input"
    ) as HTMLInputElement;
    const cycles = Number(cyclesInput.value);

    if (!cycles || cycles < 1) {
      alert("Please enter valid cycles");
      return;
    }

    const user = "user";

    const historyEntries = Array.from(rows).map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        date_complete: today,
        cycles,
        exercise: cells[0].textContent || "",
        repetitions: Number(cells[1].textContent) || 0,
        user,
      };
    });

    await this.postBatchHistory(historyEntries);

    alert("Good job! Workout saved.");
    window.location.reload();
  }

  private async postBatchHistory(
    historyEntry: Record<string, any>[]
  ): Promise<void> {
    try {
      const res = await fetch(this.apiUrlHistory, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historyEntry),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error resoponse: ", err);
        throw new Error(JSON.stringify(err));
      }
    } catch (err) {
      console.error("Error adding history entry: ", err);
    }
  }
}

const roll = new Roll();
await roll.init();
