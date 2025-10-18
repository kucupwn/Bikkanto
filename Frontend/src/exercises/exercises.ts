import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

import type { Exercises } from "../types";
import { exercisesColumnOrder } from "./exercises.utils";

const tableContainer = document.getElementById(
  "exercises-table"
) as HTMLDivElement | null;

export class ExercisesTable {
  private container: HTMLDivElement;
  private exercisesColumnOrder: string[];
  private hotInstance: Handsontable | null = null;
  private readonly apiUrl = "http://127.0.0.1:8000/exercises";

  constructor(container: HTMLDivElement, exercisesColumnOrder: string[]) {
    this.container = container;
    this.exercisesColumnOrder = exercisesColumnOrder;
  }

  private async fetchExercises(): Promise<Exercises[]> {
    const res = await fetch(this.apiUrl);
    if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`);

    return res.json();
  }

  public async init(): Promise<void> {
    try {
      const data = await this.fetchExercises();
      this.renderTable(data);
    } catch (error) {
      console.warn("Error initializing exercises table:", error);
    }
  }

  private renderTable(data: Exercises[]): void {
    const columns = this.exercisesColumnOrder.map((key) => ({
      data: key,
      title: key,
    }));

    this.hotInstance = new Handsontable(this.container, {
      data,
      columns,
      colHeaders: [...this.exercisesColumnOrder],
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
}

if (tableContainer) {
  const exercisesTable = new ExercisesTable(
    tableContainer,
    exercisesColumnOrder
  );
  exercisesTable.init();
} else {
  console.warn("Table container not found");
}
