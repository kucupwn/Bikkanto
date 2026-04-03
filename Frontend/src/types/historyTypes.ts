import type { ExerciseDifficulty, RepsDifficulty } from "./exerciseTypes";

export interface WorkoutHistory {
  id?: number;
  date_complete: string;
  exercise_id: number;
  exercise_name?: string;
  category_id: number;
  category_name?: string;
  difficulty: ExerciseDifficulty;
  reps_difficulty: RepsDifficulty;
  cycles: number;
  repetitions: number;
  sum_repetitions: number;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "exercise_name",
  "category_name",
  "difficulty",
  "reps_difficulty",
  "cycles",
  "repetitions",
  "sum_repetitions",
] as const;
