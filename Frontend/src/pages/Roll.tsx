import styled from "styled-components";
import { useEffect, useState, type ChangeEvent } from "react";
import { api } from "../api/api";
import { CategorySelection } from "../components/roll/CategorySelection";
import {
  exerciseRepetitionDifficultyOptions,
  type Category,
  type ExerciseRepetitionDifficulty,
  type Exercises,
} from "../types/exerciseTypes";
import { capitalize } from "../utils";

const RollContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const WorkoutBasePropertiesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
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

const GetButton = styled.button`
  font-size: 20px;
  padding: 0.3rem 0.5rem;
  margin: 1rem;
  cursor: pointer;
`;

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number | "">("");
  const [exerciseCountDifficulty, setExerciseCountDifficulty] =
    useState<ExerciseRepetitionDifficulty>("easy");
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercises[]>([]);

  const safeCount = typeof exerciseCount == "number" ? exerciseCount : 0;

  function handleExerciseCountChange(e: ChangeEvent<HTMLInputElement>) {
    const currentValue = Number(e.target.value);

    if (currentValue <= 0) {
      setExerciseCount("");
    } else {
      setExerciseCount(currentValue);
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

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await api("/exercises");
        const exercises = res.data;

        setExercises(exercises);
      } catch (err) {
        console.error(err);
      }
    }

    fetchExercises();
  }, []);

  return (
    <>
      <RollContainer>
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
            <span>Exercise Repetitions Difficulty:</span>
            <select name="exercise-count-difficulty">
              {exerciseRepetitionDifficultyOptions.map((diff) => (
                <option key={diff} value={diff}>
                  {capitalize(diff)}
                </option>
              ))}
            </select>
          </ExerciseCountDifficultyWrapper>
        </WorkoutBasePropertiesWrapper>
        {Array.from({ length: safeCount }).map((_, idx) => (
          <CategorySelection
            key={idx}
            currentCount={idx + 1}
            categories={categories}
          />
        ))}
        {safeCount > 0 && <GetButton>Get</GetButton>}
      </RollContainer>
    </>
  );
}
