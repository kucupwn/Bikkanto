import type {
  ExerciseDifficulty,
  RepsDifficulty,
  WorkoutOrigin,
} from "./exerciseTypes";

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
  sum_reps: number;
  // Null on rows saved before the source was recorded
  origin: WorkoutOrigin | null;
  preset_name: string | null;
}

// What the client sends when saving. The server copies name, category and
// difficulty from the exercise and computes sum_reps itself.
export interface WorkoutHistoryCreate {
  date_complete: string;
  exercise_id: number;
  reps_difficulty: RepsDifficulty;
  cycles: number;
  reps: number;
  origin: WorkoutOrigin;
  preset_id: number | null;
}

// Display label for where a workout came from
export function getWorkoutSource(entry: WorkoutHistory) {
  if (entry.origin === "preset") return entry.preset_name ?? "Preset";
  if (entry.origin === "custom") return "Custom";
  if (entry.origin === "random") return "Random";
  return "—";
}

export const HISTORY_COLUMN_ORDER = [
  "date_complete",
  "session",
  "source",
  "exercise_name",
  "category_name",
  "difficulty",
  "reps_difficulty",
  "cycles",
  "reps",
  "sum_reps",
] as const;
