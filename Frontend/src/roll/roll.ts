import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import {
  getRandomExercise,
  getSelectedCategories,
  attachRollEventListeners,
  toggleRollOverviewSubmit,
  toggleRollSettingsOverview,
  toggleUnsubmittedRollDisplay,
  getHistoryEntries,
  getWorkoutCycles,
  handleExerciseSelectionDisplay,
  fillOverviewTable,
} from "./rollUtils";

import { fetchCategories, fetchAllExercises } from "../exercises/exercisesApi";

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
        this.getOverviewTable(workout),

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

    const rows = Array.from(document.querySelectorAll(".exercise-row"));
    const existingCount = rows.length;

    handleExerciseSelectionDisplay(
      container,
      this.allCategories,
      rows,
      count,
      existingCount
    );
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

  public getOverviewTable(workout: WorkoutEntry[]): void {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    fillOverviewTable(workout, tbody);
  }

  private async saveWorkoutHistory(): Promise<void> {
    const table = document.getElementById("overview-table") as HTMLTableElement;

    const rows = table.querySelectorAll("tbody tr");

    const today = new Date().toISOString().split("T")[0];

    const cycles = getWorkoutCycles();
    if (cycles < 1) return;

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

export const roll = new Roll();
