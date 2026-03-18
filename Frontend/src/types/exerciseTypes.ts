export interface Exercise {
  id: number;
  exercise_name: string;
  difficulty: Difficulty;
  easy_min: number;
  easy_max: number;
  medium_min: number;
  medium_max: number;
  hard_min: number;
  hard_max: number;
  category_id: number;
  category_name: string;
}

export interface Category {
  id: number;
  category_name: string;
}

export const exerciseRepetitionDifficultyOptions = [
  "easy",
  "medium",
  "hard",
] as const;
export type ExerciseRepetitionDifficulty =
  (typeof exerciseRepetitionDifficultyOptions)[number];

export const difficultyOptions = ["beginner", "advanced", "pro"] as const;
export type Difficulty = (typeof difficultyOptions)[number];

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
  "category_name",
  "difficulty",
  ...NUMERIC_COLUMNS,
] as const;
