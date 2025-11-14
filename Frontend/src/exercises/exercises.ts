import Handsontable from "handsontable/base";
import type { Exercises } from "../types/exercises.types";
import { getHandsontable } from "../table/handsontable";
import {
  exercisesColumnOrder,
  exercisesColumnLabels,
  generateAddModalInput,
  generateModifyModalInput,
  generateDeleteModalInput,
  fetchAllExercises,
  fetchCategories,
  addModalHeaderTitle,
  fillModifyModalDefaultValues,
  numericColumnsSet,
} from "./exercises.utils";
import { Modal } from "bootstrap";
import { protectPage } from "../ui/protected";

const tableContainer = document.getElementById(
  "exercises-table"
) as HTMLDivElement | null;

export class ExercisesTable {
  private tableContainer: HTMLDivElement;
  private hotInstance: Handsontable | null = null;
  private allExercises: Exercises[] = [];
  private allCategories: string[] = [];
  private readonly apiUrl = "http://127.0.0.1:8000/exercises";

  constructor(container: HTMLDivElement) {
    this.tableContainer = container;
    this.attachEventListeners();
  }

  public async init(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrl);
      this.allCategories = await fetchCategories(`${this.apiUrl}/categories`);
      this.renderTable(this.allExercises);
    } catch (error) {
      console.error("Error initializing exercises table:", error);
    }
  }

  private renderTable(data: Exercises[]): void {
    const columns = exercisesColumnOrder.map((key) => ({
      data: key,
      title: exercisesColumnLabels[key],
    }));

    this.hotInstance = getHandsontable<Exercises>(
      this.tableContainer,
      data,
      columns,
      [...exercisesColumnOrder]
    );
  }

  public async refresh(): Promise<void> {
    try {
      this.allExercises = await fetchAllExercises(this.apiUrl);
      this.hotInstance?.loadData(this.allExercises);
    } catch (error) {
      console.error("Error refreshing exercises:", error);
    }
  }

  private attachEventListeners(): void {
    const addBtn = document.getElementById(
      "add-ex-btn"
    ) as HTMLButtonElement | null;
    if (addBtn)
      addBtn.addEventListener("click", () => {
        this.openModal("Add");
        addModalHeaderTitle("Add");
      });

    const modifyBtn = document.getElementById(
      "modify-ex-btn"
    ) as HTMLButtonElement | null;
    if (modifyBtn)
      modifyBtn.addEventListener("click", () => {
        this.openModal("Modify");
        addModalHeaderTitle("Modify");
      });

    const deleteBtn = document.getElementById(
      "delete-ex-btn"
    ) as HTMLButtonElement | null;
    if (deleteBtn)
      deleteBtn.addEventListener("click", () => {
        this.openModal("Delete");
        addModalHeaderTitle("Delete");
      });
  }

  private openModal(operation: string) {
    const modalBody = document.getElementById("exercise-form-body");
    if (!modalBody) return;

    if (operation === "Add") {
      modalBody.innerHTML = generateAddModalInput(this.allCategories);
    } else if (operation === "Modify") {
      modalBody.innerHTML = generateModifyModalInput(
        this.allExercises,
        this.allCategories
      );

      const selectEl = document.getElementById(
        "select-exercise"
      ) as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.addEventListener("change", (e) => {
          const selectedId = Number((e.target as HTMLSelectElement).value);
          if (selectedId && !isNaN(selectedId)) {
            fillModifyModalDefaultValues(this.allExercises, selectedId);
          }
        });
      }
    } else if (operation === "Delete") {
      modalBody.innerHTML = generateDeleteModalInput(this.allExercises);
    }

    const modalEl = document.getElementById("exercise-modal");
    if (!modalEl) return;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    this.handleFormSubmit(bootstrapModal, operation);
  }

  private getFormData(form: HTMLFormElement): Record<string, any> {
    const formData = new FormData(form);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (key === "select-exercise") {
        const selectedId = Number(value);
        const selectedExercise = this.allExercises.find(
          (ex) => ex.id === selectedId
        );
        data["exercise_id"] = selectedId;
        data["exercise_name"] = selectedExercise?.exercise_name ?? "";
      } else {
        data[key] = numericColumnsSet.has(key) ? Number(value) : String(value);
      }
    });

    return data;
  }

  private handleFormSubmit(modal: any, operation: string): void {
    const form = document.getElementById("exercise-form") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = this.getFormData(form);

      if (operation === "Add") {
        await this.postNewExercise(formData);
      } else if (operation === "Modify") {
        const { exercise_id: exerciseId, ...updateData } = formData;
        if (!exerciseId) {
          alert("Please select an exercise to modify.");
          return;
        }
        await this.updateExercise(exerciseId, updateData);
      } else if (operation === "Delete") {
        const exerciseId = formData.exercise_id;
        if (!exerciseId) {
          alert("Please select an exercise to modify.");
          return;
        }
        await this.deleteExercise(exerciseId);
      }

      modal.hide();
      form.reset();
    };
  }

  private async deleteExercise(exerciseId: number): Promise<void> {
    try {
      const res = await fetch(`${this.apiUrl}/${exerciseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error response:", err);
        throw new Error(JSON.stringify(err));
      }

      await this.refresh();
    } catch (err) {
      console.error("Error deleting exercise: ", err);
    }
  }

  private async updateExercise(
    exerciseId: number,
    update: Record<string, any>
  ): Promise<void> {
    try {
      const res = await fetch(`${this.apiUrl}/${exerciseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error response:", err);
        throw new Error(JSON.stringify(err));
      }

      await this.refresh();
    } catch (err) {
      console.error("Error updating exercise: ", err);
    }
  }

  private async postNewExercise(
    newExercise: Record<string, any>
  ): Promise<void> {
    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExercise),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error response:", err);
        throw new Error(JSON.stringify(err));
      }

      await this.refresh();
    } catch (err) {
      console.error("Error adding exercise: ", err);
    }
  }
}

if (tableContainer) {
  const exercisesTable = new ExercisesTable(tableContainer);
  await exercisesTable.init();
  protectPage();
} else {
  console.warn("Table container not found");
}
