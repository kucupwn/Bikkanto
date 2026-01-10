export interface Exercises {
  id?: number;
  exercise_name: string;
  category: string;
  difficulty: string;
  easy_min: number;
  easy_max: number;
  medium_min: number;
  medium_max: number;
  hard_min: number;
  hard_max: number;
}

export interface WorkoutEntry {
  difficulty: string;
  category: string;
  exercise: string;
  reps: number;
}

export interface ExerciseSelection {
  category: string;
  difficulty: string;
}

export const DIFFICULTY = ["beginner", "advanced", "pro"] as const;

export const NUMERIC_COLUMNS = [
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
] as const;

export const EXERCISE_COLUMNS_ORDER = [
  "exercise_name",
  "category",
  "difficulty",
  ...NUMERIC_COLUMNS,
] as const;

export const NUMERIC_COLUMN_LABELS = {
  easy_min: "Easy-min",
  easy_max: "Easy-max",
  medium_min: "Medium-min",
  medium_max: "Medium-max",
  hard_min: "Hard-min",
  hard_max: "Hard-max",
};

export const EXERCISE_COLUMN_LABELS = {
  id: "id",
  exercise_name: "Exercise",
  category: "Category",
  difficulty: "Difficulty",
  ...NUMERIC_COLUMN_LABELS,
};

export const REQUIRED_COLUMNS = ["exercise_name", "category", "difficulty"];
export const NUMERIC_COLUMNS_SET = new Set<string>(NUMERIC_COLUMNS);

export type ExercisesCallbacks = {
  onOpenOperation: (operation: ExerciseOperation) => void;
};

export const EXERCISE_OPERATIONS = {
  ADD: "Add",
  MODIFY: "Modify",
  DELETE: "Delete",
} as const;
export type ExerciseOperation =
  (typeof EXERCISE_OPERATIONS)[keyof typeof EXERCISE_OPERATIONS];
