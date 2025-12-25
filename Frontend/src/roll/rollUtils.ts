import type { Exercises, WorkoutEntry } from "../types/exercises.types";
import type { WorkoutHistory } from "../types/history.types";

export function toggleRollSettingsOverview(
  settingsContainer: HTMLElement,
  overviewContainer: HTMLElement
): void {
  settingsContainer?.classList.toggle("hidden");
  overviewContainer?.classList.toggle("hidden");
}

export function toggleRollOverviewSubmit(
  overviewTableButtonsContainer: HTMLElement,
  rollSubmitContainer: HTMLElement
): void {
  overviewTableButtonsContainer?.classList.toggle("hidden");
  rollSubmitContainer?.classList.toggle("hidden");
}

export function toggleUnsubmittedRollDisplay(
  pendingRollContainer: HTMLElement | null,
  settingsContainer: HTMLElement | null
): void {
  if (localStorage.getItem("pendingTable")) {
    pendingRollContainer?.classList.remove("hidden");
    settingsContainer?.classList.add("hidden");
  } else {
    pendingRollContainer?.classList.add("hidden");
    settingsContainer?.classList.remove("hidden");
  }
}

export function createCategorySelections(
  start: number,
  end: number,
  categories: string[],
  container: HTMLDivElement
): void {
  for (let i = start; i <= end; i++) {
    const row = document.createElement("div");
    row.classList = "exercise-row";

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.classList = "exercise-label";

    const select = document.createElement("select");
    select.id = `exercise-select-${i}`;
    select.classList = "form-select";
    select.style = "width: auto";

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

export function getSelectedCategories(): string[] {
  const container = document.getElementById("exercise-categories-container");
  if (!container) return [];

  const selectElements = container.querySelectorAll("select");

  const categorySelections: string[] = [];

  selectElements.forEach((ex) => {
    const value = (ex as HTMLSelectElement).value;
    if (value) {
      categorySelections.push(value);
    }
  });

  return categorySelections;
}

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

export function handleExerciseSelectionDisplay(
  container: HTMLDivElement,
  categories: string[],
  rows: any,
  count: number,
  existingCount: number
): void {
  if (count > existingCount) {
    createCategorySelections(existingCount + 1, count, categories, container);
  }

  if (count < existingCount) {
    for (let i = existingCount - 1; i >= count; i--) {
      rows[i].remove();
    }
  }
}

export function fillOverviewTable(
  workout: WorkoutEntry[],
  tbody: HTMLElement
): void {
  workout.forEach((entry) => {
    const row = document.createElement("tr");

    const categoryCell = document.createElement("td");
    categoryCell.textContent = entry.category;

    const exerciseCell = document.createElement("td");
    exerciseCell.textContent = entry.exercise;

    const repsCell = document.createElement("td");
    repsCell.textContent = entry.reps.toString();

    row.appendChild(categoryCell);
    row.appendChild(exerciseCell);
    row.appendChild(repsCell);
    tbody.appendChild(row);
  });
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
