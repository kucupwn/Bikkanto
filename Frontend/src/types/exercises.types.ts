export interface Exercises {
  id: number;
  exercise_name: string;
  category: string;
  easy_min: number;
  easy_max: number;
  medium_min: number;
  medium_max: number;
  hard_min: number;
  hard_max: number;
}

export interface WorkoutEntry {
  category: string;
  exercise: string;
  reps: number;
}

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
