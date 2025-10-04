interface Exercises {
  exercise_name: string;
  category: string;
  easy_min: number;
  easy_max: number;
  medium_min: number;
  medium_max: number;
  hard_min: number;
  hard_max: number;
}

const allExercises: Exercises[] = await getAllExercises();

async function getAllExercises(): Promise<Exercises[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data: Exercises[] = await res.json();

    return data;
  } catch (err) {
    console.log("Error loading data: ", err);
    return [];
  }
}

export function getExerciseCategories(): string[] {
  const categories = Array.from(new Set(allExercises.map((ex) => ex.category)));

  return categories;
}

export function fillExerciseCount(
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
