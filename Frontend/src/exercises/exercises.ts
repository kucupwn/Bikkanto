import Handsontable from "handsontable/base";
import { renderTable } from "../table/handsontable";
import {
  type ExerciseOperation,
  type Exercises,
  EXERCISE_COLUMNS_ORDER,
  EXERCISE_COLUMN_LABELS,
} from "../types/exercises.types";
import { fetchAllExercises, fetchCategories } from "./exercisesApi";
import {
  setExercisesModalHeaderTitle,
  getModalForExercisesOperation,
} from "./exercisesModal";
import { attachExercisesEventListeners } from "./exercisesUtils";
import { handleFormSubmit } from "./exercisesForm";
import { EXERCISES_API_URL } from "../api/urls";
import { Modal } from "bootstrap";

export class ExercisesTable {
  private hotInstance: Handsontable | null = null;
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrl = EXERCISES_API_URL;
  private tableContainer: HTMLDivElement = document.getElementById(
    "exercises-table"
  ) as HTMLDivElement;

  constructor() {
    attachExercisesEventListeners({
      onOpenOperation: (operation) => this.openModal(operation),
    });
  }

  public async init(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrl);
      this.allCategories = await fetchCategories(`${this.apiUrl}/categories`);
      this.hotInstance = renderTable(
        this.tableContainer,
        this.allExercises,
        EXERCISE_COLUMNS_ORDER,
        EXERCISE_COLUMN_LABELS
      );
    } catch (error) {
      console.error("Error initializing exercises table:", error);
    }
  }

  public async refresh(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrl);
      this.hotInstance?.loadData(this.allExercises);
    } catch (error) {
      console.error("Error refreshing exercises:", error);
    }
  }

  private openModal(operation: ExerciseOperation) {
    const modalBody = document.getElementById("exercise-form-body");
    if (!modalBody) return;

    setExercisesModalHeaderTitle(operation);

    getModalForExercisesOperation(
      modalBody,
      operation,
      this.allExercises,
      this.allCategories
    );

    const modalEl = document.getElementById("exercise-modal");
    if (!modalEl) return;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    handleFormSubmit(
      bootstrapModal,
      operation,
      this.allExercises,
      this.apiUrl,
      () => this.refresh()
    );
  }
}

export const exercisesTable = new ExercisesTable();
