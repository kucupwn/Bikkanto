import { Modal } from "bootstrap";
import type { Category } from "../types/exercises.types";
import { getCategoryOptions } from "./exercisesModal";

export function openCategoryModal(categories: Category[]): void {
  const modalBody = document.getElementById("exercise-form-body");
  if (!modalBody) return;

  modalBody.innerHTML = getCategoryModal(categories);

  categoryModalController();

  const modalEl = document.getElementById("exercise-modal");
  if (!modalEl) return;

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();
}

function categoryModalController(): void {
  const wrapper = document.getElementById("category-action-wrapper");
  if (!wrapper) return;

  const buttons = document.getElementById("category-action-buttons");
  const addSection = document.getElementById("category-add-section");
  const deleteSection = document.getElementById("category-delete-section");
  const saveBtn = document.querySelector<HTMLButtonElement>(
    "#exercise-form button[type='submit']",
  );

  saveBtn?.classList.add("d-none");

  wrapper.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-action]",
    );
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    buttons?.classList.add("d-none");

    saveBtn?.classList.remove("d-none");
    saveBtn!.dataset.action = action;

    if (action === "add") {
      addSection?.classList.remove("d-none");
    }

    if (action === "delete") {
      deleteSection?.classList.remove("d-none");
    }
  });
}

function getCategoryModal(categories: Category[]): string {
  const categoryOptions = getCategoryOptions(categories);
  const title = document.getElementById("exercise-modal-label");
  if (!title) return "";

  title.textContent = "Select category operation";

  return `
    <div id="category-action-wrapper">

      <!-- ACTION BUTTONS -->
      <div id="category-action-buttons" class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-success w-50"
          data-action="add"
        >
          Add
        </button>

        <button
          type="button"
          class="btn btn-danger w-50"
          data-action="delete"
        >
          Delete
        </button>
      </div>

      <!-- ADD -->
      <div id="category-add-section" class="d-none mt-3">
        <label class="form-label">New category name</label>
        <input
          type="text"
          class="form-control"
          id="category-name-input"
          name="category_name"
        />
      </div>

      <!-- DELETE -->
      <div id="category-delete-section" class="d-none mt-3">
        <label class="form-label">Select category for delete</label>
        <select
          class="form-select"
          id="category-delete-select"
          name="category_id"
        >
          <option value="">-- Select --</option>
          ${categoryOptions}
        </select>
      </div>

    </div>
  `;
}
