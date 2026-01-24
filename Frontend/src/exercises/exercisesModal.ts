import {
  type Exercises,
  type ExerciseOperation,
  EXERCISE_OPERATIONS,
  NUMERIC_COLUMNS,
  NUMERIC_COLUMN_LABELS,
  NUMERIC_COLUMNS_SET,
  EXERCISE_COLUMNS_ORDER,
  EXERCISE_COLUMN_LABELS,
  REQUIRED_COLUMNS,
  DIFFICULTY,
  type Category,
} from "../types/exercises.types";
import { getCategoryOptions } from "./exercisesCategory";
import { handleFormSubmit } from "./exercisesForm";
import { Modal } from "bootstrap";

export function openModal(
  apiUrl: string,
  operation: ExerciseOperation,
  allExercises: Exercises[],
  allCategories: Category[],
  onSuccess: () => Promise<void>,
) {
  const modalBody = document.getElementById("exercise-form-body");
  if (!modalBody) return;

  setExercisesModalHeaderTitle(operation);

  getModalForExercisesOperation(
    modalBody,
    operation,
    allExercises,
    allCategories,
  );

  const modalEl = document.getElementById("exercise-modal");
  if (!modalEl) return;

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  handleFormSubmit(bootstrapModal, operation, allExercises, apiUrl, () =>
    onSuccess(),
  );
}

export function setExercisesModalHeaderTitle(operation: string) {
  const title = document.getElementById("exercise-modal-label");
  if (!title) return;

  title.textContent = `${operation} exercise`;
}

function getDifficultyOptions(): string {
  const options = DIFFICULTY.map(
    (opt) => `<option value="${opt}">${opt.toUpperCase()}</option>`,
  ).join("");

  return options;
}

function getExerciseOptions(allExercises: Exercises[]) {
  const options = allExercises
    .map(
      (opt) =>
        `<option value="${opt.id}">${opt.exercise_name.toUpperCase()}</option>`,
    )
    .join("");

  return options;
}

export function getModalForExercisesOperation(
  modalBody: HTMLElement,
  operation: ExerciseOperation,
  allExercises: Exercises[],
  allCategories: Category[],
): void {
  if (operation === EXERCISE_OPERATIONS.ADD) {
    modalBody.innerHTML = generateAddModalInput(allCategories);
  } else if (operation === EXERCISE_OPERATIONS.MODIFY) {
    modalBody.innerHTML = generateModifyModalInput(allExercises, allCategories);

    const selectEl = document.getElementById(
      "select-exercise",
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

function fillModifyModalDefaultValues(
  exercises: Exercises[],
  selectedId: number,
) {
  const selectedExercises = exercises.find((ex) => ex.id === selectedId);
  if (!selectedExercises) return;

  const categorySelect = document.getElementById(
    "select-category",
  ) as HTMLSelectElement | null;
  if (categorySelect) {
    categorySelect.value = String(selectedExercises.category_id);
  }

  const difficultySelect = document.getElementById(
    "select-difficulty",
  ) as HTMLSelectElement | null;
  if (difficultySelect) {
    difficultySelect.value = selectedExercises.difficulty;
  }

  NUMERIC_COLUMNS.forEach((col) => {
    const input = document.getElementById(col) as HTMLInputElement | null;
    if (input) {
      input.value = String(selectedExercises[col as keyof Exercises] ?? "");
    }
  });
}

function generateAddModalInput(allCategories: Category[]): string {
  const categoryOptions = getCategoryOptions(allCategories);
  const difficultyOptions = getDifficultyOptions();

  return `
    <div class="row row-cols-2 g-3">
      ${EXERCISE_COLUMNS_ORDER.map((col) => {
        const isRequired = REQUIRED_COLUMNS.includes(col) ? "required" : "";
        const colClass = col === "exercise_name" ? "col-12" : "col";

        if (col === "category_name") {
          return `
            <div class="${colClass}">
              <label for="${col}" class="form-label">${EXERCISE_COLUMN_LABELS[col]}</label>
              <select class="form-select" id="category-select" name="category_id" ${isRequired}>
                <option value="">-- Select --</option>
                ${categoryOptions}
              </select>
            </div>
          `;
        } else if (col === "difficulty") {
          return `
            <div class="${colClass}">
              <label for="${col}" class="form-label">${EXERCISE_COLUMN_LABELS[col]}</label>
              <select class="form-select" id="difficulty-select" name="${col}" ${isRequired}>
                <option value="">-- Select --</option>
                ${difficultyOptions}
              </select>
            </div>
          `;
        } else {
          const inputType = NUMERIC_COLUMNS_SET.has(col) ? "number" : "text";
          const defaultValue = NUMERIC_COLUMNS_SET.has(col) ? "1" : "";

          return `
                <div class="${colClass}">
                  <label for="${col}" class="form-label">${EXERCISE_COLUMN_LABELS[col]}</label>
                  <input type="${inputType}" class="form-control" id="${col}" name="${col}" value="${defaultValue}" ${isRequired}>
                </div>
              `;
        }
      }).join("")}
    </div>
  `;
}

function generateModifyModalInput(
  exercises: Exercises[],
  allCategories: Category[],
) {
  const exerciseOptions = getExerciseOptions(exercises);
  const categoryOptions = getCategoryOptions(allCategories);
  const difficultyOptions = getDifficultyOptions();

  return `
    <div class="row row-cols-2 g-3">
      <div class="col-12">
        <label for="exercises" class="form-label">Exercises</label>
        <select class="form-select" id="select-exercise" name="select-exercise">
          <option value="">-- Select --</option>
          ${exerciseOptions}
        </select>
      </div>
      <div class="col">
        <label for="select-category" class="form-label">Category</label>
        <select class="form-select" id="select-category" name="category_id">
          <option value="">-- Select --</option>
          ${categoryOptions}
        </select>
      </div>
      <div class="col">
        <label for="select-difficulty" class="form-label">Difficulty</label>
        <select class="form-select" id="select-difficulty" name="difficulty">
          <option value="">-- Select --</option>
          ${difficultyOptions}
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

function generateDeleteModalInput(exercises: Exercises[]) {
  const exerciseOptions = getExerciseOptions(exercises);

  return `
  <div class="col">
    <label for="exercises" class="form-label">Exercises</label>
    <select class="form-select" id="select-exercise" name="select-exercise">
      <option value="">-- Select --</option>
      ${exerciseOptions}
    </select>
  </div>
  `;
}
