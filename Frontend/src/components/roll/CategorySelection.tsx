import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  repsDifficultyOptions,
  type Category,
  type ExerciseDifficulty,
  type RepsDifficulty,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import type { ProperySelection } from "./WorkoutSettings";
import type { ChangeEvent } from "react";

interface Props {
  currentCount: number;
  categories: Category[];
  value: ProperySelection;
  onChange: (newValue: ProperySelection) => void;
}

const CategorySelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem;
`;

export function CategorySelection({
  currentCount,
  categories,
  value,
  onChange,
}: Props) {
  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...value, categoryId: Number(e.target.value) });
  }

  function handleExerciseDifficultyChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({
      ...value,
      exerciseDifficulty: e.target.value as ExerciseDifficulty,
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
      <select name="category-select" onChange={handleCategoryChange}>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category_name}
          </option>
        ))}
      </select>
      <select
        name="exercise-difficulty-select"
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
