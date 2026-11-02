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
import { Select } from "../ui";

const SelectionRow = styled.li`
  display: grid;
  grid-template-columns: 2.25rem 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.875rem 0;
  border-top: 1px solid var(--line-soft);
`;

const RowNo = styled.span`
  display: grid;
  place-items: center;
  height: 40px;
  border-radius: 2px;
  background: var(--board);
  color: var(--board-ink);
  font-family: var(--font-board);
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

const SelectGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  > :first-child {
    grid-column: 1 / -1;
  }
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
  const filteredExercises = exercises.filter(
    (exc) =>
      exc.category_id === value.categoryId &&
      exc.difficulty === value.exerciseDifficulty,
  );

  function getFirstMatchingExerciseId(
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
            exerciseId: getFirstMatchingExerciseId(
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
            exerciseId: getFirstMatchingExerciseId(
              value.categoryId,
              difficulty,
            ),
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
    <SelectionRow>
      <RowNo aria-hidden="true">{currentCount}</RowNo>
      <SelectGroup>
        <Select
          name="category-select"
          aria-label={`Exercise ${currentCount} category`}
          value={value.categoryId}
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {capitalize(cat.category_name)}
            </option>
          ))}
        </Select>
        {workoutCreationMode === "preset" && (
          <Select
            name="exercise-select"
            aria-label={`Exercise ${currentCount}`}
            value={value.exerciseId}
            onChange={handleExerciseChange}
            style={{ gridColumn: "1 / -1" }}
          >
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exc) => (
                <option key={exc.id} value={exc.id}>
                  {capitalize(exc.exercise_name)}
                </option>
              ))
            ) : (
              <option value={0}>No exercise at this difficulty</option>
            )}
          </Select>
        )}
        <Select
          name="exercise-difficulty-select"
          aria-label={`Exercise ${currentCount} difficulty`}
          value={value.exerciseDifficulty}
          onChange={handleExerciseDifficultyChange}
        >
          {exerciseDifficultyOptions.map((diff) => (
            <option key={diff} value={diff}>
              {capitalize(diff)}
            </option>
          ))}
        </Select>
        <Select
          name="reps-difficulty-select"
          aria-label={`Exercise ${currentCount} reps difficulty`}
          value={value.repsDifficulty}
          onChange={handleRepsDifficultyChange}
        >
          {repsDifficultyOptions.map((diff) => (
            <option key={diff} value={diff}>
              {capitalize(diff)} reps
            </option>
          ))}
        </Select>
      </SelectGroup>
    </SelectionRow>
  );
}
