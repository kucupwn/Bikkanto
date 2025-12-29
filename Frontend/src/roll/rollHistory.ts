import { type WorkoutHistory } from "../types/history.types";

import { users } from "../users/users";

import { HISTORY_API_URL } from "../api/urls";
import { historyTable } from "../history/history";
import { postBatchHistory } from "../history/historyApi";
import { showFeedback } from "../ribbon/feedbackRibbon";

function getHistoryEntries(
  rows: NodeListOf<Element>,
  today: string,
  cycles: number,
  user: string
): WorkoutHistory[] {
  const historyEntries = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      date_complete: today,
      cycles,
      category: cells[0].textContent || "",
      exercise: cells[1].textContent || "",
      repetitions: Number(cells[2].textContent) || 0,
      sum_repetitions: (Number(cells[2].textContent) || 0) * cycles,
      user,
    };
  });

  return historyEntries;
}

function getWorkoutCycles(): number {
  const cyclesInput = document.getElementById(
    "cycles-input"
  ) as HTMLInputElement;
  const cycles = Number(cyclesInput.value);

  if (!cycles || cycles < 1) {
    showFeedback("Please enter valid cycles", "error");
    return 0;
  }

  return cycles;
}

export async function saveWorkoutHistory(): Promise<void> {
  const table = document.getElementById("overview-table") as HTMLTableElement;

  const rows = table.querySelectorAll("tbody tr");

  const today = new Date().toISOString().split("T")[0];

  const cycles = getWorkoutCycles();
  if (cycles < 1) return;

  const userDetails = users.getCurrentUser();
  if (!userDetails) {
    showFeedback("Login to save workout!", "error");
    return;
  }

  const user = userDetails.username;

  const historyEntries = getHistoryEntries(rows, today, cycles, user);

  await postBatchHistory(historyEntries, HISTORY_API_URL);
  await historyTable.refresh();
}
