import { getExerciseCategories, fillExerciseCount } from "./roll.utils";

async function getExerciseSelections(containerId: string, count: number) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = await getExerciseCategories();

  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = `exercise-row-${i}`;

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.htmlFor = `exercise-label-${i}`;

    const select = document.createElement("select");
    select.id = `exercise-select-${i}`;

    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- Select --";
    select.appendChild(option);

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);

    container.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillExerciseCount("exercise-count-select", 0, 20);

  const select = document.getElementById(
    "exercise-count-select"
  ) as HTMLSelectElement;
  if (select) {
    select.addEventListener("change", () => {
      const count = Number(select.value);
      getExerciseSelections("exercises", count);
    });
  }
});
