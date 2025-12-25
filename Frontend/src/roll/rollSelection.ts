export async function getExerciseSelections(
  count: number,
  allCategories: string[]
): Promise<void> {
  const container = document.getElementById(
    "exercise-categories-container"
  ) as HTMLDivElement;
  if (!container) return;

  const rows = Array.from(document.querySelectorAll(".exercise-row"));
  const existingCount = rows.length;

  handleExerciseSelectionDisplay(
    container,
    allCategories,
    rows,
    count,
    existingCount
  );
}

export function createCategorySelections(
  start: number,
  end: number,
  categories: string[],
  container: HTMLDivElement
): void {
  for (let i = start; i <= end; i++) {
    const row = document.createElement("div");
    row.classList = "exercise-row";

    const label = document.createElement("label");
    label.textContent = `Exercise ${i}`;
    label.classList = "exercise-label";

    const select = document.createElement("select");
    select.id = `exercise-select-${i}`;
    select.classList = "form-select";
    select.style = "width: auto";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = "-- Select --";
    select.appendChild(option);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.toUpperCase();
      select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);

    container.appendChild(row);
  }
}

export function handleExerciseSelectionDisplay(
  container: HTMLDivElement,
  categories: string[],
  rows: any,
  count: number,
  existingCount: number
): void {
  if (count > existingCount) {
    createCategorySelections(existingCount + 1, count, categories, container);
  }

  if (count < existingCount) {
    for (let i = existingCount - 1; i >= count; i--) {
      rows[i].remove();
    }
  }
}

export function getSelectedCategories(): string[] {
  const container = document.getElementById("exercise-categories-container");
  if (!container) return [];

  const selectElements = container.querySelectorAll("select");

  const categorySelections: string[] = [];

  selectElements.forEach((ex) => {
    const value = (ex as HTMLSelectElement).value;
    if (value) {
      categorySelections.push(value);
    }
  });

  return categorySelections;
}
