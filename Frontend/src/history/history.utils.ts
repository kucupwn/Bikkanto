import type { History } from "../types/history.types";

export const historyColumnOrder = [
  "date_complete",
  "cycles",
  "exercise",
  "repetitions",
  "sum_repetitions",
  "user",
] as const;

export const historyColumnLabels = {
  date_complete: "Date",
  cycles: "Cycles",
  exercise: "Exercise",
  repetitions: "Repetitions",
  sum_repetitions: "Total Reps",
  user: "User",
};

export async function fetchAllHistory(apiUrl: string): Promise<History[]> {
  try {
    const res = await fetch(apiUrl);
    const data: History[] = await res.json();

    return data;
  } catch (err) {
    console.warn("Error loading data: ", err);

    return [];
  }
}
