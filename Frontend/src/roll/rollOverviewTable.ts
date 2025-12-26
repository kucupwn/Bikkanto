import { type WorkoutEntry } from "../types/exercises.types";
import { toggleUnsubmittedRollDisplay } from "./rollView";

export function getOverviewTable(workout: WorkoutEntry[]): void {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  fillOverviewTable(workout, tbody);
}

function fillOverviewTable(workout: WorkoutEntry[], tbody: HTMLElement): void {
  workout.forEach((entry) => {
    const row = document.createElement("tr");

    const categoryCell = document.createElement("td");
    categoryCell.textContent = entry.category;

    const exerciseCell = document.createElement("td");
    exerciseCell.textContent = entry.exercise;

    const repsCell = document.createElement("td");
    repsCell.textContent = entry.reps.toString();

    row.appendChild(categoryCell);
    row.appendChild(exerciseCell);
    row.appendChild(repsCell);
    tbody.appendChild(row);
  });
}

export function loadUnsubmittedTable(
  overviewContainer: HTMLElement | null,
  overviewTableButtonsContainer: HTMLElement | null,
  rollSubmitContainer: HTMLElement | null,
  pendingRollContainer: HTMLElement | null
): void {
  const table = localStorage.getItem("pendingTable");

  if (table) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table, "text/html");
    const tbody = doc.querySelector("tbody");
    const actualTBody = overviewContainer?.querySelector("tbody");

    if (tbody && actualTBody) {
      actualTBody.innerHTML = tbody.innerHTML;
    }

    toggleUnsubmittedRollDisplay(
      overviewContainer,
      overviewTableButtonsContainer,
      rollSubmitContainer,
      pendingRollContainer
    );
  }
}
