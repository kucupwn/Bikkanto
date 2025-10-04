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

export async function getExerciseCategories(): Promise<string[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data: Exercises[] = await res.json();

    const categories = Array.from(new Set(data.map((ex) => ex.category)));

    return categories;
  } catch (err) {
    console.log("Error loading data: ", err);
    return [];
  }
}
