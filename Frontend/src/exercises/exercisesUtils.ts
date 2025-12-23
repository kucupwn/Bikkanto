import {
  type ExercisesCallbacks,
  type ExerciseOperation,
} from "../types/exercises.types";
import { EXERCISE_OPERATIONS } from "../types/exercises.types";

export function attachExercisesEventListeners(
  callback: ExercisesCallbacks
): void {
  const bindOperation = (buttonId: string, operation: ExerciseOperation) => {
    const el = document.getElementById(buttonId) as HTMLButtonElement;
    if (el)
      el.addEventListener("click", () => callback.onOpenOperation(operation));
  };

  bindOperation("add-ex-btn", EXERCISE_OPERATIONS.ADD);
  bindOperation("modify-ex-btn", EXERCISE_OPERATIONS.MODIFY);
  bindOperation("delete-ex-btn", EXERCISE_OPERATIONS.DELETE);
}
