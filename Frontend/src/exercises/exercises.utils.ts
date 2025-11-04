import type { Exercises } from "../types/exercises.types";

export const exercisesColumnOrder = [
  "exercise_name",
  "category",
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
] as const;

export const exerciseColumnLabels = {
  exercise_name: "Exercise",
  category: "Category",
  easy_min: "Easy-min",
  easy_max: "Easy-max",
  medium_min: "Medium-min",
  medium_max: "Medium-max",
  hard_min: "Hard-min",
  hard_max: "Hard-max",
};

export const numericColumns = [
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
];

const requiredColumns = ["exercise_name", "category"];

export async function fetchAllExercises(apiUrl: string): Promise<Exercises[]> {
  try {
    const res = await fetch(apiUrl);
    const data: Exercises[] = await res.json();

    return data;
  } catch (err) {
    console.log("Error loading data: ", err);

    return [];
  }
}

export async function fetchCategories(apiUrl: string): Promise<string[]> {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch categories");

    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function addModalHeaderTitle(operation: string) {
  const title = document.getElementById("exercise-modal-label");
  if (!title) return;

  title.textContent = `${operation} exercise`;
}

function getCategoryOptions(categories: string[]) {
  const options = categories
    .map((opt) => `<option value="${opt}">${opt.toUpperCase()}</option>`)
    .join("");

  return options;
}

function getExerciseOptions(allExercises: Exercises[]) {
  const options = allExercises
    .map(
      (opt) =>
        `<option value="${opt.id}">${opt.exercise_name.toUpperCase()}</option>`
    )
    .join("");

  return options;
}

export function fillModifyModalDefaultValues(
  exercises: Exercises[],
  selectedId: number
) {
  const selectedExercises = exercises.find((ex) => ex.id === selectedId);
  if (!selectedExercises) return;

  const categorySelect = document.getElementById(
    "select-category"
  ) as HTMLSelectElement | null;
  if (categorySelect) {
    categorySelect.value = selectedExercises.category;
  }

  numericColumns.forEach((col) => {
    const input = document.getElementById(col) as HTMLInputElement | null;
    if (input) {
      input.value = String(selectedExercises[col as keyof Exercises] ?? "");
    }
  });
}

export function generateAddModalInput(allCategories: string[]): string {
  const categoryOptions = getCategoryOptions(allCategories);

  return `
    <div class="row row-cols-2 g-3">
      ${exercisesColumnOrder
        .map((col) => {
          const isRequired = requiredColumns.includes(col) ? "required" : "";

          if (col === "category") {
            return `
            <div class="col">
              <label for="${col}" class="form-label">${col}</label>
              <select class="form-select" id="${col}" name="${col}" ${isRequired}>
                <option>-- Select --</option>
                ${categoryOptions}
              </select>
            </div>
          `;
          } else {
            const inputType = numericColumns.includes(col) ? "number" : "text";
            const defaultValue = numericColumns.includes(col) ? "1" : "";

            return `
                <div class="col">
                  <label for="${col}" class="form-label">${col}</label>
                  <input type="${inputType}" class="form-control" id="${col}" name="${col}" value="${defaultValue}" ${isRequired}>
                </div>
              `;
          }
        })
        .join("")}
    </div>
  `;
}

export function generateModifyModalInput(
  exercises: Exercises[],
  allCategories: string[]
) {
  const exerciseOptions = getExerciseOptions(exercises);
  const categoryOptions = getCategoryOptions(allCategories);

  return `
    <div class="row row-cols-2 g-3">
      <div class="col">
        <label for="exercises" class="form-label">Exercises</label>
        <select class="form-select" id="select-exercise" name="select-exercise">
          <option>-- Select --</option>
          ${exerciseOptions}
        </select>
      </div>
      <div class="col">
        <label for="categories" class="form-label">Categories</label>
        <select class="form-select" id="select-category" name="category">
          <option>-- Select --</option>
          ${categoryOptions}
        </select>
      </div>
      ${numericColumns
        .map((col) => {
          return `
            <div class="col">
              <label for="${col}" class="form-label">${col}</label>
              <input type="number" class="form-control" id="${col}" name="${col}" >
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function generateDeleteModalInput(exercises: Exercises[]) {
  const exerciseOptions = getExerciseOptions(exercises);

  return `
  <div class="col">
    <label for="exercises" class="form-label">Exercises</label>
    <select class="form-select" id="select-exercise" name="select-exercise">
      <option>-- Select --</option>
      ${exerciseOptions}
    </select>
  </div>
  `;
}
