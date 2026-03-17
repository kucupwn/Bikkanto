import styled from "styled-components";
import { useEffect, useState, type ChangeEvent } from "react";
import { api } from "../api/api";
import { CategorySelection } from "../components/roll/CategorySelection";
import {
  exerciseCountDifficultyOptions,
  type Category,
  type ExerciseCountDifficulty,
} from "../types/exerciseTypes";

const WorkoutBasePropertiesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  justify-self: center;
  margin: 1rem;
  width: 60vw;
`;

const ExerciseCountWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const ExerciseCountDifficultyWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [exerciseCountDifficulty, setExerciseCountDifficulty] =
    useState<ExerciseCountDifficulty>("easy");
  const [categories, setCategories] = useState<Category[]>([]);

  function handleExerciseCountChange(e: ChangeEvent<HTMLInputElement>) {
    const currentValue = Number(e.target.value);

    if (currentValue < 0) {
      setExerciseCount(0);
    } else {
      setExerciseCount(Number(currentValue));
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api("/exercises/categories");
        const categories = res.data;

        setCategories(categories);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      <WorkoutBasePropertiesWrapper>
        <ExerciseCountWrapper>
          <span>Exercise Count:</span>
          <input
            type="number"
            value={exerciseCount}
            onChange={handleExerciseCountChange}
          />
        </ExerciseCountWrapper>
        <ExerciseCountDifficultyWrapper>
          <span>Exercise Count Difficulty:</span>
          <select name="exercise-count-difficulty">
            {exerciseCountDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </ExerciseCountDifficultyWrapper>
      </WorkoutBasePropertiesWrapper>
      {Array.from({ length: exerciseCount }).map((_, idx) => (
        <CategorySelection
          key={idx}
          currentCount={idx + 1}
          categories={categories}
        />
      ))}
    </>
  );
}
