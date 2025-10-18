import type { WorkoutEntry } from "../types";
import {
  getExerciseCategories,
  getRandomExercise,
  getSelectedCategories,
} from "./roll.utils";

const getButton = document.getElementById("btn-get");

function getExerciseSelections(count: number) {
  const container = document.getElementById(
    "exercise-categories"
  ) as HTMLDivElement;
  if (!container) return;

  const categories = getExerciseCategories();

  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = `exercise-row-${i}`;

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.htmlFor = `exercise-label-${i}`;

    const select = document.createElement("select");
    select.id = `exercise-select-${i}`;

    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- Select --";
    select.appendChild(option);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.toUpperCase();
      select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);

    container.appendChild(row);
  }
}

function handleExerciseSelection() {
  const select = document.getElementById(
    "exercise-count-select"
  ) as HTMLSelectElement;
  if (select) {
    select.addEventListener("change", () => {
      const count = Number(select.value);
      getExerciseSelections(count);
    });
  }
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

getButton?.addEventListener("click", () => {
  const workout = getWorkout();
  fillOverviewTable(workout);
});

handleExerciseSelection();
