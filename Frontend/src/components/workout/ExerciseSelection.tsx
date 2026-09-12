import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  repsDifficultyOptions,
  type Category,
  type Exercise,
  type ExerciseDifficulty,
  type RepsDifficulty,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import type { ProperySelection } from "./WorkoutSettings";
import type { ChangeEvent } from "react";
import type { WorkoutCreationType } from "../../pages/Workout";

const CategorySelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem;
`;

interface Props {
  currentCount: number;
  categories: Category[];
  exercises: Exercise[];
  value: ProperySelection;
  onChange: (newValue: ProperySelection) => void;
  workoutCreationMode: WorkoutCreationType;
}

export function ExerciseSelection({
  currentCount,
  categories,
  exercises,
  value,
  onChange,
  workoutCreationMode,
}: Props) {
  function getFirstMatchingExercise(
    categoryId: number,
    difficulty: ExerciseDifficulty,
  ) {
    return (
      exercises.find(
        (exc) =>
          exc.category_id === categoryId && exc.difficulty === difficulty,
      )?.id ?? 0
    );
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const categoryId = Number(e.target.value);

    onChange({
      ...value,
      categoryId,
      ...(workoutCreationMode === "preset"
        ? {
            exerciseId: getFirstMatchingExercise(
              categoryId,
              value.exerciseDifficulty,
            ),
          }
        : {}),
    });
  }

  function handleExerciseChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({
      ...value,
      exerciseId: Number(e.target.value),
    });
  }

  function handleExerciseDifficultyChange(e: ChangeEvent<HTMLSelectElement>) {
    const difficulty = e.target.value as ExerciseDifficulty;

    onChange({
      ...value,
      exerciseDifficulty: difficulty,
      ...(workoutCreationMode === "preset"
        ? {
            exerciseId: getFirstMatchingExercise(value.categoryId, difficulty),
          }
        : {}),
    });
  }

  function handleRepsDifficultyChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({
      ...value,
      repsDifficulty: e.target.value as RepsDifficulty,
    });
  }

  return (
    <CategorySelectionContainer>
      <span>Exercise {currentCount}:</span>
      <select
        name="category-select"
        value={value.categoryId}
        onChange={handleCategoryChange}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {capitalize(cat.category_name)}
          </option>
        ))}
      </select>
      {workoutCreationMode === "preset" && (
        <select
          name="exercise-select"
          value={value.exerciseId}
          onChange={handleExerciseChange}
        >
          {exercises
            .filter(
              (exc) =>
                exc.category_id === value.categoryId &&
                exc.difficulty === value.exerciseDifficulty,
            )
            .map((exc) => (
              <option key={exc.id} value={exc.id}>
                {capitalize(exc.exercise_name)}
              </option>
            ))}
        </select>
      )}
      <select
        name="exercise-difficulty-select"
        value={value.exerciseDifficulty}
        onChange={handleExerciseDifficultyChange}
      >
        {exerciseDifficultyOptions.map((diff) => (
          <option key={diff} value={diff}>
            {capitalize(diff)}
          </option>
        ))}
      </select>
      <select
        name="reps-difficulty-select"
        value={value.repsDifficulty}
        onChange={handleRepsDifficultyChange}
      >
        {repsDifficultyOptions.map((diff) => (
          <option key={diff} value={diff}>
            {capitalize(diff)}
          </option>
        ))}
      </select>
    </CategorySelectionContainer>
  );
}
