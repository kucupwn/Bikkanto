import {
  type Exercises,
  type ExerciseOperation,
  EXERCISE_OPERATIONS,
  NUMERIC_COLUMNS_SET,
} from "../types/exercises.types";
import {
  postNewExercise,
  updateExercise,
  deleteExercise,
} from "./exercisesApi";

function getFormData(
  form: HTMLFormElement,
  allExercises: Exercises[],
): Record<string, any> {
  const formData = new FormData(form);
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key === "select-exercise") {
      const selectedId = Number(value);
      const selectedExercise = allExercises.find((ex) => ex.id === selectedId);
      data["exercise_id"] = selectedId;
      data["exercise_name"] = selectedExercise?.exercise_name ?? "";
    } else if (key === "category_id") {
      data["category_id"] = Number(value);
    } else {
      data[key] = NUMERIC_COLUMNS_SET.has(key) ? Number(value) : String(value);
    }
  });

  return data;
}

export function handleFormSubmit(
  modal: any,
  operation: ExerciseOperation,
  allExercises: Exercises[],
  apiUrl: string,
  onSuccess: () => Promise<void>,
): void {
  const form = document.getElementById("exercise-form") as HTMLFormElement;
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = getFormData(form, allExercises);

    if (operation === EXERCISE_OPERATIONS.ADD) {
      await postNewExercise(formData, apiUrl);
      await onSuccess();
    } else if (operation === EXERCISE_OPERATIONS.MODIFY) {
      const { exercise_id: exerciseId, ...updateData } = formData;
      if (!exerciseId) {
        alert("Please select an exercise to modify.");
        return;
      }
      await updateExercise(exerciseId, updateData, apiUrl);
      await onSuccess();
    } else if (operation === EXERCISE_OPERATIONS.DELETE) {
      const exerciseId = formData.exercise_id;
      if (!exerciseId) {
        alert("Please select an exercise to modify.");
        return;
      }
      await deleteExercise(exerciseId, apiUrl);
      await onSuccess();
    }

    modal.hide();
    form.reset();
  };
}
