import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import { attachRollEventListeners } from "./rollEvents";
import {
  toggleRollSettingsOverview,
  toggleRollOverviewSubmit,
  togglePendingRollOptions,
} from "./rollView";
import {
  getExerciseSelectionRows,
  getSelectedCategories,
  getRandomExercise,
} from "./rollSelection";
import { loadUnsubmittedTable, getOverviewTable } from "./rollOverviewTable";
import { saveWorkoutHistory } from "./rollHistory";

import { fetchCategories, fetchAllExercises } from "../exercises/exercisesApi";

import { EXERCISES_API_URL, EXERCISES_CATEGORY_API_URL } from "../api/urls";
import { showFeedback } from "../ribbon/feedbackRibbon";

export class Roll {
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private overviewTableButtonsContainer: HTMLElement | null;
  private rollSubmitContainer: HTMLElement | null;
  private settingsContainer: HTMLElement | null;
  private overviewContainer: HTMLElement | null;
  private pendingRollContainer: HTMLElement | null;
  private finishedRollContainer: HTMLElement | null;

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
    this.finishedRollContainer = document.getElementById(
      "finished-roll-container"
    );

    attachRollEventListeners({
      onGetExerciseSelectionRows: (exerciseCount: number) =>
        getExerciseSelectionRows(exerciseCount, this.allCategories),

      onGetWorkout: () => this.getWorkout(),

      onFillOverviewTable: (workout: WorkoutEntry[]) =>
        getOverviewTable(workout),

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

      onSaveWorkoutHistory: async () =>
        await saveWorkoutHistory(
          this.overviewContainer,
          this.finishedRollContainer
        ),
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
      this.allExercises = await fetchAllExercises(EXERCISES_API_URL);
      this.allCategories = await fetchCategories(EXERCISES_CATEGORY_API_URL);
    } catch (err: any) {
      showFeedback("Failed to fetch exercises", "error");
      console.error(err);
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
}

export const roll = new Roll();
