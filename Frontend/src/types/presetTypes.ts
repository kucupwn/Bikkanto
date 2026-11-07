import type { ExerciseDifficulty, RepsDifficulty } from "./exerciseTypes";

// A preset row as the server returns it. Name, difficulty and category are read
// live from the linked exercise, so edits to the exercise show up here.
export interface PresetExercise {
  id: number;
  position: number;
  exercise_id: number;
  exercise_name: string;
  difficulty: ExerciseDifficulty;
  category_id: number;
  category_name: string;
  reps_difficulty: RepsDifficulty;
  reps: number;
}

export interface Preset {
  id: number;
  preset_name: string;
  created_at: string;
  exercises: PresetExercise[];
}

export interface PresetExerciseCreate {
  exercise_id: number;
  reps_difficulty: RepsDifficulty;
  reps: number;
}

// Body for POST /presets and PUT /presets/{id}. Array order is the exercise
// order; PUT replaces the whole exercise list.
export interface PresetCreate {
  preset_name: string;
  exercises: PresetExerciseCreate[];
}
