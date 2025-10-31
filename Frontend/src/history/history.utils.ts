import type { History } from "../types/history.types";

export const historyColumnOrder = [
  "date_complete",
  "cycles",
  "exercise",
  "repetitions",
  "user",
];

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
