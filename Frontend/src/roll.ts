function fillExerciseCount(
  selectId: string,
  start: number,
  stop: number
): void {
  const exerciseCount = document.getElementById(
    selectId
  ) as HTMLSelectElement | null;
  if (!exerciseCount) return;

  exerciseCount.innerHTML = "";

  for (let i = start; i <= stop; i++) {
    let option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    exerciseCount.appendChild(option);
  }
}

function getExerciseSelections(containerId: string, count: number) {
  const container = document.getElementById(containerId);
  if (!container) return;

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
