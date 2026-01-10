export interface WorkoutHistory {
  id?: number;
  date_complete: string;
  exercise: string;
  category: string;
  difficulty: string;
  cycles: number;
  repetitions: number;
  sum_repetitions: number;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "exercise",
  "category",
  "difficulty",
  "cycles",
  "repetitions",
  "sum_repetitions",
] as const;

export const HISTORY_COLUMN_LABELS = {
  id: "id",
  date_complete: "Date",
  exercise: "Exercise",
  category: "Category",
  difficulty: "Difficulty",
  cycles: "Cycles",
  repetitions: "Repetitions",
  sum_repetitions: "Total Reps",
};

export type HistoryCallbacks = {
  onOpenStats: () => void;
};
