import type { WorkoutEntry } from "../types/exercises.types";
import {
  getExerciseCategories,
  createCategorySelections,
  getRandomExercise,
  getSelectedCategories,
} from "./roll.utils";

const getButton = document.getElementById("btn-get");
const exerciseCountInput = document.getElementById(
  "exercise-count-input"
) as HTMLInputElement;

function getExerciseSelections(count: number) {
  const container = document.getElementById(
    "exercise-categories"
  ) as HTMLDivElement;
  if (!container) return;

  const categories = getExerciseCategories();

  container.innerHTML = "";

  createCategorySelections(count, categories, container);
}

function getWorkout(): WorkoutEntry[] {
  const difficulty = (
    document.getElementById("exercise-difficulty") as HTMLSelectElement
  ).value;
  const selectedCategories = getSelectedCategories();
  const workout = selectedCategories?.map((category) => {
    return getRandomExercise(category, difficulty);
  });

  return workout;
}

function fillOverviewTable(workout: WorkoutEntry[]) {
  const table = document.getElementById("overview-table") as HTMLTableElement;
  if (!table) return;

  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  workout.forEach((entry) => {
    const row = document.createElement("tr");

    const exerciseCell = document.createElement("td");
    exerciseCell.textContent = entry.exercise;

    const repsCell = document.createElement("td");
    repsCell.textContent = entry.reps.toString();

    row.appendChild(exerciseCell);
    row.appendChild(repsCell);
    tbody.appendChild(row);
  });
}

exerciseCountInput.addEventListener("change", () => {
  const exerciseCount = Number(exerciseCountInput.value);
  getExerciseSelections(exerciseCount);
});

getButton?.addEventListener("click", () => {
  const workout = getWorkout();
  fillOverviewTable(workout);
});
