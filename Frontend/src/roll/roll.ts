import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import {
  getRandomExercise,
  getHistoryEntries,
  getWorkoutCycles,
  fillOverviewTable,
} from "./rollUtils";
import { attachRollEventListeners } from "./rollEvents";
import {
  toggleRollSettingsOverview,
  toggleRollOverviewSubmit,
  togglePendingRollOptions,
} from "./rollView";
import { getExerciseSelections, getSelectedCategories } from "./rollSelection";
import { loadUnsubmittedTable } from "./rollOverviewTable";

import { fetchCategories, fetchAllExercises } from "../exercises/exercisesApi";

import { users } from "../users/users";
import { postBatchHistory } from "../history/historyApi";
import {
  EXERCISES_API_URL,
  EXERCISES_CATEGORY_API_URL,
  HISTORY_API_URL,
} from "../api/urls";
import { historyTable } from "../history/history";

export class Roll {
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrlExercises = EXERCISES_API_URL;
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
        getExerciseSelections(exerciseCount, this.allCategories),

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
      onTogglePendingRollOptions: () =>
        togglePendingRollOptions(
          this.pendingRollContainer,
          this.settingsContainer
        ),
      onLoadUnsubmittedTable: () =>
        loadUnsubmittedTable(
          this.overviewContainer,
          this.overviewTableButtonsContainer,
          this.rollSubmitContainer,
          this.pendingRollContainer
        ),
    });

    togglePendingRollOptions(this.pendingRollContainer, this.settingsContainer);
  }

  public async init(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrlExercises);
      this.allCategories = await fetchCategories(EXERCISES_CATEGORY_API_URL);
    } catch (err) {
      console.log("Error fetching exercises:", err);
    }
  }

  private getWorkout(): WorkoutEntry[] {
    const difficulty = (
      document.getElementById("exercise-difficulty") as HTMLSelectElement
    ).value;
    const selectedCategories = getSelectedCategories();
    const workout = selectedCategories?.map((category) => {
      return getRandomExercise(this.allExercises, category, difficulty);
    });

    return workout;
  }

  private getOverviewTable(workout: WorkoutEntry[]): void {
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

    await postBatchHistory(historyEntries, HISTORY_API_URL);
    await historyTable.refresh();

    alert("Good job! Workout saved.");
    window.location.href = "/history.html";
  }
}

export const roll = new Roll();
