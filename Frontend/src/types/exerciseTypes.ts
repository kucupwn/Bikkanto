export interface Exercise {
  id?: number;
  exercise_name: string;
  difficulty: ExerciseDifficulty;
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
  id?: number;
  category_name: string;
}

export const repsDifficultyOptions = ["easy", "medium", "hard"] as const;
export type RepsDifficulty = (typeof repsDifficultyOptions)[number];

export const exerciseDifficultyOptions = [
  "beginner",
  "advanced",
  "pro",
] as const;
export type ExerciseDifficulty = (typeof exerciseDifficultyOptions)[number];

export interface WorkoutEntry {
  exercise_id: number;
  exercise_name: string;
  category_id: number;
  category_name: string;
  difficulty: ExerciseDifficulty;
  reps_difficulty: RepsDifficulty;
  reps: number;
}

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
