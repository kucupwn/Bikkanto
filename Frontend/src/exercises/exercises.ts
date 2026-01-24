import Handsontable from "handsontable/base";
import { renderTable } from "../table/handsontable";
import {
  type Category,
  type ExerciseTableRow,
  type Exercises,
  EXERCISE_COLUMNS_ORDER,
  EXERCISE_COLUMN_LABELS,
} from "../types/exercises.types";
import { fetchAllExercises, fetchCategories } from "./exercisesApi";
import { openModal } from "./exercisesModal";
import { attachExercisesEventListeners } from "./exercisesEvents";
import { EXERCISES_API_URL, EXERCISES_CATEGORY_API_URL } from "../api/urls";
import { showFeedback } from "../ribbon/feedbackRibbon";
import { openCategoryModal } from "./exercisesCategory";

export class ExercisesTable {
  private hotInstance: Handsontable | null = null;
  private allExercises: Exercises[] = [];
  private allCategories: Category[] = [];
  private readonly apiUrl = EXERCISES_API_URL;
  private readonly apiUrlCategory = EXERCISES_CATEGORY_API_URL;
  private tableContainer: HTMLDivElement = document.getElementById(
    "exercises-table",
  ) as HTMLDivElement;

  constructor() {
    attachExercisesEventListeners({
      onOpenOperation: (operation) =>
        openModal(
          this.apiUrl,
          operation,
          this.allExercises,
          this.allCategories,
          () => this.refresh(),
        ),
      onOpenCategory: () =>
        openCategoryModal(this.apiUrlCategory, this.allCategories, () =>
          this.refresh(),
        ),
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
      this.allCategories = await fetchCategories(this.apiUrlCategory);
      this.hotInstance?.loadData(this.allExercises);
    } catch (err: any) {
      showFeedback("Error refreshing exercises table", "error");
      console.error(err.message);
    }
  }
}

export const exercisesTable = new ExercisesTable();
