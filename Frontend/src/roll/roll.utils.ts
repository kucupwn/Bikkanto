import type { Exercises, WorkoutEntry } from "../types/exercises.types";

const allExercises: Exercises[] = await getAllExercises();

async function getAllExercises(): Promise<Exercises[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data: Exercises[] = await res.json();

    return data;
  } catch (err) {
    console.log("Error loading data: ", err);

    return [];
  }
}

export function getExerciseCategories(): string[] {
  const categories = Array.from(new Set(allExercises.map((ex) => ex.category)));

  return categories;
}

export function createCategorySelections(
  count: number,
  categories: string[],
  container: HTMLDivElement
): void {
  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.classList = "exercise-row";
    row.style = "margin: 20px";

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.htmlFor = `exercise-label-${i}`;
    label.style = "margin-right: 20px";

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
  const container = document.getElementById("exercise-categories");
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
  category: string,
  difficulty: string
): WorkoutEntry {
  const filtered = allExercises.filter((ex) => ex.category === category);

  if (filtered.length === 0) {
    return { exercise: "No exercise found", reps: 0 };
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const exercise = filtered[idx];

  const minKey = `${difficulty}_min` as keyof Exercises;
  const maxKey = `${difficulty}_max` as keyof Exercises;

  const minRep = exercise[minKey] as number;
  const maxRep = exercise[maxKey] as number;

  const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

  return {
    exercise: exercise.exercise_name,
    reps,
  };
}
