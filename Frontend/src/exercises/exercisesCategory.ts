import { Modal } from "bootstrap";
import { CATEGORY_OPERATIONS, type Category } from "../types/exercises.types";
import { deleteCategory, postNewCategory } from "./exercisesApi";

export function getCategoryOptions(categories: Category[]): string {
  const options = categories
    .map(
      (opt) =>
        `<option value="${opt.id}">${opt.category_name.toUpperCase()}</option>`,
    )
    .join("");

  return options;
}

export function openCategoryModal(
  apiUrl: string,
  categories: Category[],
  onSuccess: () => Promise<void>,
): void {
  const modalBody = document.getElementById("exercise-form-body");
  if (!modalBody) return;

  modalBody.innerHTML = getCategoryModal(categories);

  categoryModalController();

  const modalEl = document.getElementById("exercise-modal");
  if (!modalEl) return;

  const bootstrapModal = new Modal(modalEl);
  bootstrapModal.show();

  handleCategoryFormSubmit(bootstrapModal, apiUrl, onSuccess);
}

function handleCategoryFormSubmit(
  modal: bootstrap.Modal,
  apiUrl: string,
  onSuccess: () => Promise<void>,
): void {
  const form = document.getElementById("exercise-form") as HTMLFormElement;
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const submitBtn = e.submitter as HTMLButtonElement;
    const operation = submitBtn.dataset.action;

    if (!operation) return;

    if (operation === CATEGORY_OPERATIONS.ADD) {
      const input = form.querySelector<HTMLInputElement>(
        "#category-name-input",
      );
      if (!input?.value.trim()) return;

      await postNewCategory({ category_name: input.value }, apiUrl);
      await onSuccess();
    }

    if (operation === CATEGORY_OPERATIONS.DELETE) {
      const select = form.querySelector<HTMLSelectElement>(
        "#category-delete-select",
      );
      if (!select?.value) return;
      console.log(select.value);

      await deleteCategory(Number(select.value), apiUrl);
      await onSuccess();
    }

    modal.hide();
    form.reset();
  };
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

  title.textContent = "Category operation";

  return `
    <div id="category-action-wrapper">

      <!-- ACTION BUTTONS -->
      <div id="category-action-buttons" class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-outline-primary w-50"
          data-action="add"
        >
          Add
        </button>

        <button
          type="button"
          class="btn btn-outline-primary w-50"
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
