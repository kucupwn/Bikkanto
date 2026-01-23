import { type WorkoutHistory } from "../types/history.types";
import { HISTORY_API_URL } from "../api/urls";
import { postBatchHistory } from "../history/historyApi";
import { showFeedback } from "../ribbon/feedbackRibbon";
import { toggleFinishedWorkoutDisplay } from "./rollView";
import type { WorkoutEntry } from "../types/exercises.types";

function getHistoryEntries(
  workout: WorkoutEntry[],
  today: string,
  cycles: number,
): WorkoutHistory[] {
  return workout.map((entry) => ({
    date_complete: today,
    exercise_id: entry.exercise_id,
    exercise_name: entry.exercise_name,
    category_id: entry.category_id,
    category_name: entry.category_name,
    difficulty: entry.difficulty,
    cycles,
    repetitions: entry.reps,
    sum_repetitions: entry.reps * cycles,
  }));
}

function getWorkoutCycles(): number {
  const cyclesInput = document.getElementById(
    "cycles-input",
  ) as HTMLInputElement;
  const cycles = Number(cyclesInput.value);

  if (!cycles || cycles < 1) {
    showFeedback("Please enter valid cycles", "error");
    return 0;
  }

  return cycles;
}

export async function saveWorkoutHistory(
  currentWorkout: WorkoutEntry[],
  overviewContainer: HTMLElement | null,
  finishedRollContainer: HTMLElement | null,
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const cycles = getWorkoutCycles();
  if (cycles < 1) return;

  const historyEntries = getHistoryEntries(currentWorkout, today, cycles);

  await postBatchHistory(historyEntries, HISTORY_API_URL);
  toggleFinishedWorkoutDisplay(overviewContainer, finishedRollContainer);
}
