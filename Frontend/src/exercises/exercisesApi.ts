import { apiRequest } from "../api/apiRequest";
import { exercisesTable } from "./exercises";

export async function postNewExercise(
  newExercise: Record<string, any>,
  apiUrl: string
): Promise<void> {
  try {
    await apiRequest(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExercise),
    });
    await exercisesTable.refresh();
  } catch (err: any) {
    alert(err.message || "Failed to add new exercise.");
  }
}

export async function updateExercise(
  exerciseId: number,
  update: Record<string, any>,
  apiUrl: string
): Promise<void> {
  try {
    await apiRequest(`${apiUrl}/${exerciseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    await exercisesTable.refresh();
  } catch (err: any) {
    alert(err.message || "Failed to update exercise.");
  }
}

export async function deleteExercise(
  exerciseId: number,
  apiUrl: string
): Promise<void> {
  try {
    await apiRequest(`${apiUrl}/${exerciseId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await exercisesTable.refresh();
  } catch (err: any) {
    alert(err.message || "Failed to delete exercise.");
  }
}
