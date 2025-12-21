import { apiRequest } from "../api/apiRequest";
import {
  type Exercises,
  type ExercisesCallbacks,
  type ExerciseOperation,
  NUMERIC_COLUMNS,
  EXERCISE_COLUMNS_ORDER,
  NUMERIC_COLUMN_LABELS,
  EXERCISE_COLUMN_LABELS,
  REQUIRED_COLUMNS,
  NUMERIC_COLUMNS_SET,
} from "../types/exercises.types";
import { EXERCISE_OPERATIONS } from "../types/exercises.types";

export async function fetchAllExercises(apiUrl: string): Promise<Exercises[]> {
  try {
    const data = await apiRequest<Exercises[]>(apiUrl);

    return data;
  } catch (err: any) {
    alert(err.message || "Failed to fetch exercises.");

    return [];
  }
}

export async function fetchCategories(apiUrl: string): Promise<string[]> {
  try {
    const data = await apiRequest(apiUrl);

    return data;
  } catch (err: any) {
    alert(err.message || "Failed to fetch categories.");

    return [];
  }
}

export function attachExercisesEventListeners(
  callback: ExercisesCallbacks
): void {
  const bindOperation = (buttonId: string, operation: ExerciseOperation) => {
    const el = document.getElementById(buttonId) as HTMLButtonElement;
    if (el)
      el.addEventListener("click", () => callback.onOpenOperation(operation));
  };

  bindOperation("add-ex-btn", EXERCISE_OPERATIONS.ADD);
  bindOperation("modify-ex-btn", EXERCISE_OPERATIONS.MODIFY);
  bindOperation("delete-ex-btn", EXERCISE_OPERATIONS.DELETE);
}

export function setExercisesModalHeaderTitle(operation: string) {
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

export function getModalForExercisesOperation(
  modalBody: HTMLElement,
  operation: ExerciseOperation,
  allExercises: Exercises[],
  allCategories: string[]
): void {
  if (operation === EXERCISE_OPERATIONS.ADD) {
    modalBody.innerHTML = generateAddModalInput(allCategories);
  } else if (operation === EXERCISE_OPERATIONS.MODIFY) {
    modalBody.innerHTML = generateModifyModalInput(allExercises, allCategories);

    const selectEl = document.getElementById(
      "select-exercise"
    ) as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.addEventListener("change", (e) => {
        const selectedId = Number((e.target as HTMLSelectElement).value);
        if (selectedId && !isNaN(selectedId)) {
          fillModifyModalDefaultValues(allExercises, selectedId);
        }
      });
    }
  } else if (operation === EXERCISE_OPERATIONS.DELETE) {
    modalBody.innerHTML = generateDeleteModalInput(allExercises);
  }
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

  NUMERIC_COLUMNS.forEach((col) => {
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
      ${EXERCISE_COLUMNS_ORDER.map((col) => {
        const isRequired = REQUIRED_COLUMNS.includes(col) ? "required" : "";

        if (col === "category") {
          return `
            <div class="col">
              <label for="${col}" class="form-label">${EXERCISE_COLUMN_LABELS[col]}</label>
              <select class="form-select" id="${col}" name="${col}" ${isRequired}>
                <option>-- Select --</option>
                ${categoryOptions}
              </select>
            </div>
          `;
        } else {
          const inputType = NUMERIC_COLUMNS_SET.has(col) ? "number" : "text";
          const defaultValue = NUMERIC_COLUMNS_SET.has(col) ? "1" : "";

          return `
                <div class="col">
                  <label for="${col}" class="form-label">${EXERCISE_COLUMN_LABELS[col]}</label>
                  <input type="${inputType}" class="form-control" id="${col}" name="${col}" value="${defaultValue}" ${isRequired}>
                </div>
              `;
        }
      }).join("")}
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
      ${NUMERIC_COLUMNS.map((col) => {
        return `
            <div class="col">
              <label for="${col}" class="form-label">${NUMERIC_COLUMN_LABELS[col]}</label>
              <input type="number" class="form-control" id="${col}" name="${col}" >
            </div>
          `;
      }).join("")}
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
