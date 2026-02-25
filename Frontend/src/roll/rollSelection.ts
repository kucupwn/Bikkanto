import { showFeedback } from "../ribbon/feedbackRibbon";
import {
  DIFFICULTY,
  type Category,
  type Difficulty,
  type Exercises,
  type ExerciseSelection,
  type WorkoutEntry,
} from "../types/exercises.types";
import type { RepsDifficulty } from "../types/history.types";

export function getExerciseSelectionRows(
  count: number,
  allCategories: Category[],
): void {
  const container = document.getElementById(
    "exercise-categories-container",
  ) as HTMLDivElement;
  if (!container) return;

  const rows = Array.from(document.querySelectorAll(".exercise-row"));
  const existingCount = rows.length;

  handleExerciseSelectionRowsDisplay(
    container,
    allCategories,
    rows,
    count,
    existingCount,
  );
}

export function getRandomExercise(
  exercises: Exercises[],
  categories: Category[],
  category: number,
  exerciseDifficulty: string,
  repsDifficulty: RepsDifficulty,
  usedExerciseIds: Set<Number>,
): WorkoutEntry | null {
  const filtered = exercises.filter(
    (ex) =>
      ex.category_id === category &&
      ex.difficulty === exerciseDifficulty &&
      !usedExerciseIds.has(ex.id),
  );

  if (filtered.length === 0) {
    const [missingCategory] = categories.filter((cat) => cat.id === category);
    showFeedback(
      `There is no ${exerciseDifficulty.toUpperCase()} ${missingCategory.category_name.toUpperCase()}`,
      "error",
    );
    return null;
  }

  const exercise = filtered[Math.floor(Math.random() * filtered.length)];

  const minKey = `${repsDifficulty}_min` as keyof Exercises;
  const maxKey = `${repsDifficulty}_max` as keyof Exercises;

  const minRep = exercise[minKey] as number;
  const maxRep = exercise[maxKey] as number;

  const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

  return {
    exercise_id: exercise.id,
    exercise_name: exercise.exercise_name,
    category_id: exercise.category_id,
    category_name: exercise.category_name,
    difficulty: exercise.difficulty,
    reps_difficulty: repsDifficulty,
    reps,
  };
}

function createCategorySelectionDropdowns(
  start: number,
  end: number,
  categories: Category[],
  container: HTMLDivElement,
): void {
  for (let i = start; i <= end; i++) {
    const row = document.createElement("div");
    row.classList = "exercise-row";

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;

    const selectCategory = document.createElement("select");
    selectCategory.classList = "form-select category";

    const selectDifficulty = document.createElement("select");
    selectDifficulty.classList = "form-select difficulty";

    const optionCategory = document.createElement("option");
    optionCategory.value = "";
    optionCategory.textContent = "-- Category --";
    selectCategory.appendChild(optionCategory);

    const optionDifficulty = document.createElement("option");
    optionDifficulty.value = "";
    optionDifficulty.textContent = "-- Difficulty --";
    selectDifficulty.appendChild(optionDifficulty);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id.toString();
      option.textContent = category.category_name.toUpperCase();
      selectCategory.appendChild(option);
    });

    DIFFICULTY.forEach((diff) => {
      const option = document.createElement("option");
      option.value = diff;
      option.textContent = diff.toUpperCase();
      selectDifficulty.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(selectCategory);
    row.appendChild(selectDifficulty);

    container.appendChild(row);
  }
}

function handleExerciseSelectionRowsDisplay(
  container: HTMLDivElement,
  categories: Category[],
  rows: any,
  count: number,
  existingCount: number,
): void {
  if (count > existingCount) {
    createCategorySelectionDropdowns(
      existingCount + 1,
      count,
      categories,
      container,
    );
  }

  if (count < existingCount) {
    for (let i = existingCount - 1; i >= count; i--) {
      rows[i].remove();
    }
  }
}

export function getSelectedCategories(): ExerciseSelection[] {
  const container = document.getElementById("exercise-categories-container");
  if (!container) return [];

  const rows = container.querySelectorAll(".exercise-row");

  const selections: ExerciseSelection[] = [];

  rows.forEach((row) => {
    const categorySelect = row.querySelector(
      "select.category",
    ) as HTMLSelectElement | null;

    const difficultySelect = row.querySelector(
      "select.difficulty",
    ) as HTMLSelectElement | null;

    const category_id = Number(categorySelect?.value);
    const difficulty = difficultySelect?.value as Difficulty;

    if (!category_id) {
      showFeedback("Please select category", "error");
      return;
    }
    if (!difficulty) {
      showFeedback("Please select difficulty", "error");
      return;
    }

    selections.push({ category_id, difficulty });
  });

  return selections;
}
