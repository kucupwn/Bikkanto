import { apiRequest, authHeaders } from "../api/apiRequest";
import { showFeedback } from "../ribbon/feedbackRibbon";
import { type Category, type Exercises } from "../types/exercises.types";

export async function fetchAllExercises(apiUrl: string): Promise<Exercises[]> {
  try {
    const data = await apiRequest<Exercises[]>(apiUrl, {
      headers: authHeaders(),
    });

    return data;
  } catch (err: any) {
    showFeedback("Failed to fetch exercises", "error");
    alert(err.message);

    return [];
  }
}

export async function fetchCategories(apiUrl: string): Promise<Category[]> {
  try {
    const data = await apiRequest(apiUrl, {
      headers: authHeaders(),
    });

    return data;
  } catch (err: any) {
    showFeedback("Failed to fetch categories", "error");
    console.error(err.message);

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
      headers: authHeaders(),
      body: JSON.stringify(newExercise),
    });
    showFeedback("New exercise added successfully", "success");
  } catch (err: any) {
    showFeedback("Failed to add new exercise", "error");
    console.error(err.message);
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
      headers: authHeaders(),
      body: JSON.stringify(update),
    });
    showFeedback("Exercise updated successfully", "success");
  } catch (err: any) {
    showFeedback("Failed to update exercise", "error");
    console.error(err.message);
  }
}

export async function deleteExercise(
  exerciseId: number,
  apiUrl: string
): Promise<void> {
  try {
    await apiRequest(`${apiUrl}/${exerciseId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    showFeedback("Exercise deleted successfully", "success");
  } catch (err: any) {
    showFeedback("Failed to delete exercise", "error");
    console.error(err.message);
  }
}
