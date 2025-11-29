export interface History {
  id: number;
  date_complete: Date;
  cycles: number;
  exercise: string;
  repetitions: number;
  sum_repetitions: number;
  user: string;
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "cycles",
  "category",
  "exercise",
  "repetitions",
  "sum_repetitions",
  "user",
] as const;

export const HISTORY_COLUMN_LABELS = {
  date_complete: "Date",
  cycles: "Cycles",
  category: "Category",
  exercise: "Exercise",
  repetitions: "Repetitions",
  sum_repetitions: "Total Reps",
  user: "User",
};
