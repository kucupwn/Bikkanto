import type { Difficulty } from "./exercises.types";

export interface WorkoutHistory {
  id?: number;
  date_complete: string;
  exercise_id: number;
  exercise_name?: string;
  category_id: number;
  category_name?: string;
  difficulty: Difficulty;
  cycles: number;
  repetitions: number;
  sum_repetitions: number;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "exercise_name",
  "category_name",
  "difficulty",
  "cycles",
  "repetitions",
  "sum_repetitions",
] as const;

export const HISTORY_COLUMN_LABELS = {
  id: "ID",
  exercise_id: "Exercise id",
  category_id: "Category id",
  date_complete: "Date",
  exercise_name: "Exercise",
  category_name: "Category",
  difficulty: "Difficulty",
  cycles: "Cycles",
  repetitions: "Repetitions",
  sum_repetitions: "Total Reps",
};

export type HistoryCallbacks = {
  onOpenStats: () => void;
};
