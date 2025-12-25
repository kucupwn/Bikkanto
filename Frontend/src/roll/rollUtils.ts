import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import type { WorkoutHistory } from "../types/history.types";

export function getRandomExercise(
  exercises: Exercises[],
  category: string,
  difficulty: string
): WorkoutEntry {
  const filtered = exercises.filter((ex) => ex.category === category);

  if (filtered.length === 0) {
    return {
      category: "No exercise found",
      exercise: "No exercise found",
      reps: 0,
    };
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const exercise = filtered[idx];

  const minKey = `${difficulty}_min` as keyof Exercises;
  const maxKey = `${difficulty}_max` as keyof Exercises;

  const minRep = exercise[minKey] as number;
  const maxRep = exercise[maxKey] as number;

  const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

  return {
    category: exercise.category,
    exercise: exercise.exercise_name,
    reps,
  };
}

export function getWorkoutCycles(): number {
  const cyclesInput = document.getElementById(
    "cycles-input"
  ) as HTMLInputElement;
  const cycles = Number(cyclesInput.value);

  if (!cycles || cycles < 1) {
    alert("Please enter valid cycles");
    return 0;
  }

  return cycles;
}

export function getHistoryEntries(
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
