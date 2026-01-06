import { type WorkoutHistory } from "../types/history.types";
import { HISTORY_API_URL } from "../api/urls";
import { postBatchHistory } from "../history/historyApi";
import { showFeedback } from "../ribbon/feedbackRibbon";
import { toggleFinishedWorkoutDisplay } from "./rollView";

function getHistoryEntries(
  rows: NodeListOf<Element>,
  today: string,
  cycles: number
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

export async function saveWorkoutHistory(
  overviewContainer: HTMLElement | null,
  finishedRollContainer: HTMLElement | null
): Promise<void> {
  const table = document.getElementById("overview-table") as HTMLTableElement;

  const rows = table.querySelectorAll("tbody tr");

  const today = new Date().toISOString().split("T")[0];

  const cycles = getWorkoutCycles();
  if (cycles < 1) return;

  const historyEntries = getHistoryEntries(rows, today, cycles);

  await postBatchHistory(historyEntries, HISTORY_API_URL);
  toggleFinishedWorkoutDisplay(overviewContainer, finishedRollContainer);
}
