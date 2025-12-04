import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import {
  createCategorySelections,
  getRandomExercise,
  getSelectedCategories,
  attachRollEventListeners,
  toggleRollOverviewSubmit,
  toggleRollSettingsOverview,
  toggleUnsubmittedRollDisplay,
  getHistoryEntries,
} from "./roll.utils";

import {
  fetchCategories,
  fetchAllExercises,
} from "../exercises/exercises.utils";

import { users } from "../users/users";
import { history } from "../history/history";

export class Roll {
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrlExercises = "http://127.0.0.1:8000/exercises";
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

    attachRollEventListeners({
      onGetExerciseSelections: (exerciseCount: number) =>
        this.getExerciseSelections(exerciseCount),

      onGetWorkout: () => this.getWorkout(),

      onFillOverviewTable: (workout: WorkoutEntry[]) =>
        this.fillOverviewTable(workout),

      onToggleRollSettingsOverview: () => {
        if (this.settingsContainer && this.overviewContainer) {
          toggleRollSettingsOverview(
            this.settingsContainer,
            this.overviewContainer
          );
        }
      },

      onToggleRollOverviewSubmit: () => {
        if (this.overviewTableButtonsContainer && this.rollSubmitContainer) {
          toggleRollOverviewSubmit(
            this.overviewTableButtonsContainer,
            this.rollSubmitContainer
          );
        }
      },

      onApplyRoll: () => {
        if (this.overviewContainer) {
          localStorage.setItem(
            "pendingTable",
            this.overviewContainer.innerHTML
          );
        }
      },

      onSaveWorkoutHistory: async () => await this.saveWorkoutHistory(),
      onToggleUnsubmittedRollDisplay: () =>
        toggleUnsubmittedRollDisplay(
          this.pendingRollContainer,
          this.settingsContainer
        ),
      onLoadUnsubmittedTable: () => this.loadUnsubmittedTable(),
    });

    toggleUnsubmittedRollDisplay(
      this.pendingRollContainer,
      this.settingsContainer
    );
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

  private loadUnsubmittedTable(): void {
    const table = localStorage.getItem("pendingTable");

    if (table) {
      this.overviewContainer?.classList.remove("hidden");

      const parser = new DOMParser();
      const doc = parser.parseFromString(table, "text/html");
      const tbody = doc.querySelector("tbody");
      const actualTBody = this.overviewContainer?.querySelector("tbody");

      if (tbody && actualTBody) {
        actualTBody.innerHTML = tbody.innerHTML;
      }

      this.overviewTableButtonsContainer?.classList.add("hidden");
      this.rollSubmitContainer?.classList.remove("hidden");
      this.pendingRollContainer?.classList.add("hidden");
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

    const historyEntries = getHistoryEntries(rows, today, cycles, user);

    await history.postBatchHistory(historyEntries);

    alert("Good job! Workout saved.");
    window.location.href = "/history.html";
  }
}

const roll = new Roll();
await roll.init();
