import type { Exercises, WorkoutEntry } from "../types/exercises.types";

export function getRandomExercise(
  exercises: Exercises[],
  category: string,
  difficulty: string
): WorkoutEntry {
  const filtered = exercises.filter((ex) => ex.category === category);

  if (filtered.length === 0) {
    return {
      category: "No exercise found",
      exercise: "No exercise found",
      reps: 0,
    };
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const exercise = filtered[idx];

  const minKey = `${difficulty}_min` as keyof Exercises;
  const maxKey = `${difficulty}_max` as keyof Exercises;

  const minRep = exercise[minKey] as number;
  const maxRep = exercise[maxKey] as number;

  const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

  return {
    category: exercise.category,
    exercise: exercise.exercise_name,
    reps,
  };
}
