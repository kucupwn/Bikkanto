import type { History } from "../types/history.types";

export async function fetchAllHistory(apiUrl: string): Promise<History[]> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: History[] = await res.json();

    return data;
  } catch (err) {
    console.warn("Error loading data: ", err);

    return [];
  }
}
