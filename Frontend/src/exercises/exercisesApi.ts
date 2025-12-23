import { apiRequest } from "../api/apiRequest";
import { type Exercises } from "../types/exercises.types";

export async function fetchAllExercises(apiUrl: string): Promise<Exercises[]> {
  try {
    const data = await apiRequest<Exercises[]>(apiUrl);

    return data;
  } catch (err: any) {
    alert(err.message || "Failed to fetch exercises.");

    return [];
  }
}

export async function fetchCategories(apiUrl: string): Promise<string[]> {
  try {
    const data = await apiRequest(apiUrl);

    return data;
  } catch (err: any) {
    alert(err.message || "Failed to fetch categories.");

    return [];
  }
}

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
  } catch (err: any) {
    alert(err.message || "Failed to delete exercise.");
  }
}
