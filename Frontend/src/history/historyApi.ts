import { apiRequest } from "../api/apiRequest";
import { showFeedback } from "../ribbon/feedbackRibbon";
import type { WorkoutHistory } from "../types/history.types";

export async function fetchAllHistory(
  apiUrl: string
): Promise<WorkoutHistory[]> {
  const token = localStorage.getItem("token");

  try {
    const data = await apiRequest<WorkoutHistory[]>(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (err: any) {
    showFeedback("Failed to fetch history", "error");
    console.error(err.message);

    return [];
  }
}

export async function postBatchHistory(
  historyEntries: Record<string, any>[],
  apiUrl: string
): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    await apiRequest(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(historyEntries),
    });
    showFeedback("History record(s) added successfully", "success");
  } catch (err: any) {
    showFeedback("Failed to add history records", "error");
    console.error(err.message);
  }
}

export async function fetchHistoryRange(
  apiUrl: string,
  startDate: string,
  endDate: string
) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  try {
    const data = await apiRequest<WorkoutHistory[]>(
      `${apiUrl}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (err: any) {
    showFeedback("History range could not be fetched", "error");
    console.error(err.message);
  }
}
