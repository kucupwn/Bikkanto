import Handsontable from "handsontable/base";
import { renderTable } from "../table/handsontable";
import {
  type Category,
  type ExerciseOperation,
  type ExerciseTableRow,
  type Exercises,
  EXERCISE_COLUMNS_ORDER,
  EXERCISE_COLUMN_LABELS,
} from "../types/exercises.types";
import { fetchAllExercises, fetchCategories } from "./exercisesApi";
import {
  setExercisesModalHeaderTitle,
  getModalForExercisesOperation,
} from "./exercisesModal";
import { attachExercisesEventListeners } from "./exercisesEvents";
import { handleFormSubmit } from "./exercisesForm";
import { EXERCISES_API_URL } from "../api/urls";
import { Modal } from "bootstrap";
import { showFeedback } from "../ribbon/feedbackRibbon";

export class ExercisesTable {
  private hotInstance: Handsontable | null = null;
  private allExercises: Exercises[] = [];
  private allCategories: Category[] = [];
  private readonly apiUrl = EXERCISES_API_URL;
  private tableContainer: HTMLDivElement = document.getElementById(
    "exercises-table",
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
      this.hotInstance = renderTable<ExerciseTableRow>(
        this.tableContainer,
        this.allExercises,
        EXERCISE_COLUMNS_ORDER,
        EXERCISE_COLUMN_LABELS,
      );
    } catch (err: any) {
      showFeedback("Error initializing exercises table", "error");
      console.error(err.message);
    }
  }

  public async refresh(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrl);
      this.hotInstance?.loadData(this.allExercises);
    } catch (err: any) {
      showFeedback("Error refreshing exercises table", "error");
      console.error(err.message);
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
      this.allCategories,
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
      () => this.refresh(),
    );
  }
}

export const exercisesTable = new ExercisesTable();
