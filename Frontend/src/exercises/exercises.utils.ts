export const exercisesColumnOrder = [
  "exercise_name",
  "category",
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
];

export const numericColumns = [
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
];

const requiredColumns = ["exercise_name", "category"];

export function generateAddModalInput() {
  return `
      <div class="row row-cols-2 g-3">
        ${exercisesColumnOrder
          .map((col) => {
            const inputType = numericColumns.includes(col) ? "number" : "text";
            const isRequired = requiredColumns.includes(col) ? "required" : "";
            return `
              <div class="col">
                <label for="${col}" class="form-label">${col}</label>
                <input type="${inputType}" class="form-control" id="${col}" name="${col}" ${isRequired}>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
}
