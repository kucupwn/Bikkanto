import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

import type { Exercises } from "../types";
import { exercisesColumnOrder } from "./exercises.utils";

export async function loadExercises() {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data: Exercises[] = await res.json();

    const container = document.getElementById("exercises-table");
    if (!container) return;

    const columns = exercisesColumnOrder.map((key) => ({
      data: key,
      title: key,
    }));

    const hotInstance = new Handsontable(container, {
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

    hotInstance.useTheme("ht-theme-main-dark");
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

loadExercises();
