export interface Exercises {
  id: number;
  exercise_name: string;
  category: string;
  easy_min: number;
  easy_max: number;
  medium_min: number;
  medium_max: number;
  hard_min: number;
  hard_max: number;
}

export interface WorkoutEntry {
  exercise: string;
  reps: number;
}
