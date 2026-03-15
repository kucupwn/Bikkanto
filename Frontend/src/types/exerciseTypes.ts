export const NUMERIC_COLUMNS = [
  "easy_min",
  "easy_max",
  "medium_min",
  "medium_max",
  "hard_min",
  "hard_max",
] as const;

export const EXERCISE_COLUMNS_ORDER = [
  "exercise_name",
  "category_name",
  "difficulty",
  ...NUMERIC_COLUMNS,
] as const;
