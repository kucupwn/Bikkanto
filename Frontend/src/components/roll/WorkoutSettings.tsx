import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  repsDifficultyOptions,
  type Category,
  type ExerciseDifficulty,
  type RepsDifficulty,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import { CategorySelection } from "./CategorySelection";
import type { GlobalPropertyType } from "../../pages/Roll";

interface Props {
  exerciseCount: number | "";
  setExerciseCount: Dispatch<SetStateAction<number | "">>;
  categories: Category[];
  selectedProperties: ProperySelection[];
  setSelectedProperties: Dispatch<SetStateAction<ProperySelection[]>>;
  onGetWorkout: () => void;
}

const WorkoutBasePropertiesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem;
  width: 60vw;
`;

const ExerciseCountWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const GlobalRepsDifficultyWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const GlobalExerciseDifficultyWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const GetButton = styled.button`
  font-size: 20px;
  padding: 0.3rem 0.5rem;
  margin: 1rem;
  cursor: pointer;
`;

export interface ProperySelection {
  categoryId: number;
  exerciseDifficulty: ExerciseDifficulty;
  repsDifficulty: RepsDifficulty;
}

export function WorkoutSettings({
  exerciseCount,
  setExerciseCount,
  categories,
  selectedProperties,
  setSelectedProperties,
  onGetWorkout,
}: Props) {
  const safeCount = typeof exerciseCount == "number" ? exerciseCount : 0;

  function handleExerciseCountChange(e: ChangeEvent<HTMLInputElement>) {
    const currentValue = Number(e.target.value);

    if (currentValue <= 0) {
      setExerciseCount("");
      setSelectedProperties([]);
    } else {
      setExerciseCount(currentValue);
      setSelectedProperties((prev) => {
        const newArray = Array.from({ length: currentValue }, (_, index) => {
          return (
            prev[index] ?? {
              categoryId: categories[0]?.id ?? 0,
              exerciseDifficulty: "beginner",
              repsDifficulty: "easy",
            }
          );
        });
        return newArray;
      });
    }
  }

  function updatePropertyAtIndex(index: number, newValue: ProperySelection) {
    setSelectedProperties((prev) => {
      const copy = [...prev];
      copy[index] = newValue;
      return copy;
    });
  }

  function setGlobalPropertySettings(
    type: GlobalPropertyType,
    value: ExerciseDifficulty | RepsDifficulty,
  ) {
    setSelectedProperties((prev) =>
      prev.map((item) => ({
        ...item,
        ...(type === "exercise"
          ? { exerciseDifficulty: value as ExerciseDifficulty }
          : { repsDifficulty: value as RepsDifficulty }),
      })),
    );
  }

  return (
    <>
      <ExerciseCountWrapper>
        <span>Exercise Count:</span>
        <input
          type="number"
          value={exerciseCount}
          onChange={handleExerciseCountChange}
        />
      </ExerciseCountWrapper>
      <WorkoutBasePropertiesWrapper>
        <GlobalExerciseDifficultyWrapper>
          <span>Global Exercise Difficulty:</span>
          <select
            name="exercise-difficulty"
            onChange={(e) =>
              setGlobalPropertySettings(
                "exercise",
                e.target.value as ExerciseDifficulty,
              )
            }
          >
            {exerciseDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {capitalize(diff)}
              </option>
            ))}
          </select>
        </GlobalExerciseDifficultyWrapper>
        <GlobalRepsDifficultyWrapper>
          <span>Global Repetitions Difficulty:</span>
          <select
            name="reps-difficulty"
            onChange={(e) =>
              setGlobalPropertySettings(
                "reps",
                e.target.value as RepsDifficulty,
              )
            }
          >
            {repsDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {capitalize(diff)}
              </option>
            ))}
          </select>
        </GlobalRepsDifficultyWrapper>
      </WorkoutBasePropertiesWrapper>
      {Array.from({ length: safeCount }).map((_, index) => (
        <CategorySelection
          key={index}
          currentCount={index + 1}
          categories={categories}
          value={selectedProperties[index]}
          onChange={(newValue) => updatePropertyAtIndex(index, newValue)}
        />
      ))}
      {safeCount > 0 && <GetButton onClick={onGetWorkout}>Get</GetButton>}
    </>
  );
}
