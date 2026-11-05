import type { ExerciseDifficulty, RepsDifficulty } from "./exerciseTypes";

// A saved history row: a snapshot of the exercise at save time, with no link
// back to the exercise or category it came from.
export interface WorkoutHistory {
  id: number;
  session: number;
  date_complete: string;
  exercise_name: string;
  category_name: string;
  difficulty: ExerciseDifficulty;
  reps_difficulty: RepsDifficulty;
  cycles: number;
  reps: number;
  sum_repetitions: number;
}

// What the client sends when saving. The server copies name, category and
// difficulty from the exercise and computes sum_repetitions itself.
export interface WorkoutHistoryCreate {
  date_complete: string;
  exercise_id: number;
  reps_difficulty: RepsDifficulty;
  cycles: number;
  reps: number;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "session",
  "exercise_name",
  "category_name",
  "difficulty",
  "reps_difficulty",
  "cycles",
  "reps",
  "sum_repetitions",
] as const;
