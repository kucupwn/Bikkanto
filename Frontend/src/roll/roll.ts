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

import { users } from "../users/users";

export class Roll {
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrlExercises = "http://127.0.0.1:8000/exercises";
  private readonly apiUrlHistory = "http://127.0.0.1:8000/history";
  private overviewTableButtonsContainer: HTMLElement | null;
  private rollSubmitContainer: HTMLElement | null;
  private settingsContainer: HTMLElement | null;
  private overviewContainer: HTMLElement | null;
  private pendingRollContainer: HTMLElement | null;

  constructor() {
    this.overviewTableButtonsContainer = document.getElementById(
      "roll-table-buttons-container"
    );
    this.rollSubmitContainer = document.getElementById("roll-submit-container");
    this.settingsContainer = document.getElementById("roll-settings-container");
    this.overviewContainer = document.getElementById("overview-container");
    this.pendingRollContainer = document.getElementById(
      "pending-roll-container"
    );
    this.attachEventListeners();
    this.handleUnsubmittedRoll();
  }

  public async init(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrlExercises);
      this.allCategories = await fetchCategories(
        `${this.apiUrlExercises}/categories`
      );
    } catch (err) {
      console.log("Error fetching exercises:", err);
    }
  }

  private attachEventListeners(): void {
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
        const workout = this.getWorkout();
        this.fillOverviewTable(workout);
        localStorage.removeItem("pendingTable");

        this.settingsContainer?.classList.toggle("hidden");
        this.overviewContainer?.classList.toggle("hidden");
      });

    const restartRollButton = document.getElementById(
      "btn-restart-roll"
    ) as HTMLButtonElement;
    if (restartRollButton)
      restartRollButton.addEventListener("click", () => {
        this.settingsContainer?.classList.toggle("hidden");
        this.overviewContainer?.classList.toggle("hidden");
      });

    const applyRollButton = document.getElementById(
      "btn-apply-roll"
    ) as HTMLButtonElement;
    if (applyRollButton)
      applyRollButton.addEventListener("click", () => {
        this.overviewTableButtonsContainer?.classList.toggle("hidden");
        this.rollSubmitContainer?.classList.toggle("hidden");
        localStorage.setItem("pendingTable", this.overviewContainer!.innerHTML);
      });

    const finishRollButton = document.getElementById(
      "btn-finish-roll"
    ) as HTMLButtonElement;
    if (finishRollButton)
      finishRollButton.addEventListener("click", async () => {
        finishRollButton.disabled = true;
        await this.saveWorkoutHistory();
        localStorage.removeItem("pendingTable");
        finishRollButton.disabled = false;
      });

    const discardButton = document.getElementById(
      "discard-roll"
    ) as HTMLButtonElement;
    if (discardButton)
      discardButton.addEventListener("click", () => {
        localStorage.removeItem("pendingTable");
        this.handleUnsubmittedRoll();
      });

    const loadButton = document.getElementById(
      "load-roll"
    ) as HTMLButtonElement;
    if (loadButton)
      loadButton.addEventListener("click", () => {
        this.loadUnsubmittedTable();
      });
  }

  private loadUnsubmittedTable(): void {
    const table = localStorage.getItem("pendingTable");

    if (table) {
      this.overviewContainer?.classList.remove("hidden");
      this.overviewContainer!.innerHTML = table;
      this.rollSubmitContainer?.classList.remove("hidden");
      this.pendingRollContainer?.classList.add("hidden");

      this.attachEventListeners();
    }
  }

  private handleUnsubmittedRoll(): void {
    if (localStorage.getItem("pendingTable")) {
      this.pendingRollContainer?.classList.remove("hidden");
      this.settingsContainer?.classList.add("hidden");
    } else {
      this.pendingRollContainer?.classList.add("hidden");
      this.settingsContainer?.classList.remove("hidden");
    }
  }

  public async getExerciseSelections(count: number): Promise<void> {
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

  public fillOverviewTable(workout: WorkoutEntry[]): void {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    workout.forEach((entry) => {
      const row = document.createElement("tr");

      const categoryCell = document.createElement("td");
      categoryCell.textContent = entry.category;

      const exerciseCell = document.createElement("td");
      exerciseCell.textContent = entry.exercise;

      const repsCell = document.createElement("td");
      repsCell.textContent = entry.reps.toString();

      row.appendChild(categoryCell);
      row.appendChild(exerciseCell);
      row.appendChild(repsCell);
      tbody.appendChild(row);
    });
  }

  private async saveWorkoutHistory(): Promise<void> {
    const table = document.getElementById("overview-table") as HTMLTableElement;

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

    const userDetails = users.getCurrentUser();
    if (!userDetails) {
      alert("Login to save workout!");
      return;
    }

    const user = userDetails.username;

    const historyEntries = Array.from(rows).map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        date_complete: today,
        cycles,
        category: cells[0].textContent || "",
        exercise: cells[1].textContent || "",
        repetitions: Number(cells[2].textContent) || 0,
        sum_repetitions: (Number(cells[2].textContent) || 0) * cycles,
        user,
      };
    });

    await this.postBatchHistory(historyEntries);

    alert("Good job! Workout saved.");
    window.location.href = "/history.html";
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
