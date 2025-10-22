import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

import type { Exercises } from "../types/exercises.types";
import {
  exercisesColumnOrder,
  numericColumns,
  generateModalInput,
  fetchAllExercises,
} from "./exercises.utils";
import { Modal } from "bootstrap";

const tableContainer = document.getElementById(
  "exercises-table"
) as HTMLDivElement | null;

export class ExercisesTable {
  private tableContainer: HTMLDivElement;
  private hotInstance: Handsontable | null = null;
  private readonly apiUrl = "http://127.0.0.1:8000/exercises";

  constructor(container: HTMLDivElement) {
    this.tableContainer = container;
    this.attachEventListeners();
  }

  public async init(): Promise<void> {
    try {
      const data = await fetchAllExercises();
      this.renderTable(data);
    } catch (error) {
      console.error("Error initializing exercises table:", error);
    }
  }

  private renderTable(data: Exercises[]): void {
    const columns = exercisesColumnOrder.map((key) => ({
      data: key,
      title: key,
    }));

    this.hotInstance = new Handsontable(this.tableContainer, {
      data,
      columns,
      colHeaders: [...exercisesColumnOrder],
      rowHeaders: true,
      width: "100%",
      height: 600,
      licenseKey: "non-commercial-and-evaluation",
      filters: true,
      dropdownMenu: true,
      stretchH: "all",
      readOnly: true,
      manualColumnResize: true,
    });

    this.hotInstance.useTheme("ht-theme-main-dark");
  }

  public async refresh(): Promise<void> {
    try {
      const data = await fetchAllExercises();
      this.hotInstance?.loadData(data);
    } catch (error) {
      console.error("Error refreshing exercises:", error);
    }
  }

  private attachEventListeners(): void {
    const addBtn = document.getElementById(
      "add-ex-btn"
    ) as HTMLButtonElement | null;
    if (addBtn) addBtn.addEventListener("click", () => this.openModal("Add"));

    const modifyBtn = document.getElementById(
      "modify-ex-btn"
    ) as HTMLButtonElement;
    if (modifyBtn)
      modifyBtn.addEventListener("click", () => this.openModal("Modify"));
  }

  private async openModal(operation: string) {
    const modalBody = document.getElementById("exercise-form-body");
    if (!modalBody) return;

    modalBody.innerHTML = (await generateModalInput(operation)) ?? "";

    const modalEl = document.getElementById("exercise-modal");
    if (!modalEl) return;

    const bootstrapModal = new Modal(modalEl);
    bootstrapModal.show();

    this.handleFormSubmit(bootstrapModal);
  }

  private getFormData(form: HTMLFormElement): Record<string, any> {
    const formData = new FormData(form);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      data[key] = numericColumns.includes(key) ? Number(value) : String(value);
    });

    return data;
  }

  private handleFormSubmit(modal: any): void {
    const form = document.getElementById("exercise-form") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();

      const newExercise = this.getFormData(form);
      await this.postNewExercise(newExercise);

      modal.hide();
      form.reset();
    };
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
        throw new Error(err.detail || "Failed to add exercise");
      }

      await this.refresh();
    } catch (err) {
      console.error("Error adding exercise:", err);
    }
  }
}

if (tableContainer) {
  const exercisesTable = new ExercisesTable(tableContainer);
  exercisesTable.init();
} else {
  console.warn("Table container not found");
}
