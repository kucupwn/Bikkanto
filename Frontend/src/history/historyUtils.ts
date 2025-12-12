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
