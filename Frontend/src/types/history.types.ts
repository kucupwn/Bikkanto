export interface WorkoutHistory {
  id?: number;
  date_complete: string;
  cycles: number;
  category: string;
  exercise: string;
  repetitions: number;
  sum_repetitions: number;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "cycles",
  "category",
  "exercise",
  "repetitions",
  "sum_repetitions",
] as const;

export const HISTORY_COLUMN_LABELS = {
  id: "id",
  date_complete: "Date",
  cycles: "Cycles",
  category: "Category",
  exercise: "Exercise",
  repetitions: "Repetitions",
  sum_repetitions: "Total Reps",
};

export type HistoryCallbacks = {
  onOpenStats: () => void;
};
