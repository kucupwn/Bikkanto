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
];

export const numericColumns = [
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
];

const requiredColumns = ["exercise_name", "category"];

export async function fetchAllExercises(): Promise<Exercises[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data: Exercises[] = await res.json();

    return data;
  } catch (err) {
    console.log("Error loading data: ", err);

    return [];
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises/categories");
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

async function getCategoryOptions() {
  const validCategories = await fetchCategories();

  const options = validCategories
    .map((opt) => `<option value="${opt}">${opt.toUpperCase()}</option>`)
    .join("");

  return options;
}

async function getExerciseOptions() {
  const allExercises = await fetchAllExercises();

  const options = allExercises
    .map(
      (opt) =>
        `<option value="${opt.id}">${opt.exercise_name.toUpperCase()}</option>`
    )
    .join("");

  return options;
}

export async function generateAddModalInput(): Promise<string> {
  const categoryOptions = await getCategoryOptions();

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

            return `
                <div class="col">
                  <label for="${col}" class="form-label">${col}</label>
                  <input type="${inputType}" class="form-control" id="${col}" name="${col}" ${isRequired}>
                </div>
              `;
          }
        })
        .join("")}
    </div>
  `;
}

export async function generateModifyModalInput() {
  const exerciseOptions = await getExerciseOptions();
  const categoryOptions = await getCategoryOptions();

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
