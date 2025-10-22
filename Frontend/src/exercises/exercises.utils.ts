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

export async function generateModalInput(operation: string): Promise<string> {
  const validCategories = await fetchCategories();

  if (operation === "Add") {
    return `
      <div class="row row-cols-2 g-3">
        ${exercisesColumnOrder
          .map((col) => {
            const isRequired = requiredColumns.includes(col) ? "required" : "";

            if (col === "category") {
              const options = validCategories
                .map((opt) => `<option value="${opt}">${opt}</option>`)
                .join("");

              return `
              <div class="col">
                <label for="${col}" class="form-label">${col}</label>
                <select class="form-select" id="${col}" name="${col}" ${isRequired}>
                  ${options}
                </select>
              </div>
            `;
            } else {
              const inputType = numericColumns.includes(col)
                ? "number"
                : "text";

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
  } else if (operation === "Modify") {
    const allExercises = await fetchAllExercises();
    const options = allExercises
      .map(
        (opt) =>
          `<option value="${opt.exercise_name}">${opt.exercise_name.toUpperCase()}</option>`
      )
      .join("");

    return `
      <div class="row row-cols-2 g-3">
          <label for="exercises" class="form-label">Exercises</label>
          <select class="form-select" id="exercises" name="exercises">
            ${options}
          </select>
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

  return "";
}
