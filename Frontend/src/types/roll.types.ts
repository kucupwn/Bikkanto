import type { WorkoutEntry } from "./exercises.types";

export type RollCallbacks = {
  onGetExerciseSelections: (exerciseCount: number) => void;
  onGetWorkout: () => WorkoutEntry[];
  onFillOverviewTable: (workout: WorkoutEntry[]) => void;
  onApplyRoll: () => void;
  onToggleRollSettingsOverview: () => void;
  onToggleRollOverviewSubmit: () => void;
  onSaveWorkoutHistory: () => Promise<void> | void;
  onTogglePendingRollOptions: () => void;
  onLoadUnsubmittedTable: () => void;
};
