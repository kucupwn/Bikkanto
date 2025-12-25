import { apiRequest } from "../api/apiRequest";
import type { WorkoutHistory } from "../types/history.types";

export async function fetchAllHistory(
  apiUrl: string
): Promise<WorkoutHistory[]> {
  try {
    const token = localStorage.getItem("token");
    const data = await apiRequest<WorkoutHistory[]>(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (err: any) {
    alert(err.message || "Failed to fetch history.");

    return [];
  }
}

export async function postBatchHistory(
  historyEntry: Record<string, any>[],
  apiUrl: string
): Promise<void> {
  try {
    await apiRequest(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(historyEntry),
    });
  } catch (err: any) {
    alert(err.message || "Failed to create history records.");
  }
}
