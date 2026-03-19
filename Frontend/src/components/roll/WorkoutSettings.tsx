import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import styled from "styled-components";
import {
  exerciseRepsDifficultyOptions,
  type Category,
  type Difficulty,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import { CategorySelection } from "./CategorySelection";

interface Props {
  exerciseCount: number | "";
  setExerciseCount: Dispatch<SetStateAction<number | "">>;
  categories: Category[];
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

export interface ProperySelection {
  categoryId: number;
  difficulty: Difficulty;
}

export function WorkoutSettings({
  exerciseCount,
  setExerciseCount,
  categories,
}: Props) {
  const safeCount = typeof exerciseCount == "number" ? exerciseCount : 0;

  const [selectedProperties, setSelectedPropterties] = useState<
    ProperySelection[]
  >([]);

  function handleExerciseCountChange(e: ChangeEvent<HTMLInputElement>) {
    const currentValue = Number(e.target.value);

    if (currentValue <= 0) {
      setExerciseCount("");
      setSelectedPropterties([]);
    } else {
      setExerciseCount(currentValue);
      setSelectedPropterties((prev) => {
        const newArray = Array.from({ length: currentValue }, (_, index) => {
          return (
            prev[index] ?? {
              categoryId: categories[0]?.id ?? 0,
              difficulty: "beginner",
            }
          );
        });
        return newArray;
      });
    }
  }

  function updatePropertyAtIndex(index: number, newValue: ProperySelection) {
    setSelectedPropterties((prev) => {
      const copy = [...prev];
      copy[index] = newValue;
      return copy;
    });
  }

  function getWorkout() {
    console.log(selectedProperties);
  }

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
          <span>Exercise Repetitions Difficulty:</span>
          <select name="exercise-count-difficulty">
            {exerciseRepsDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {capitalize(diff)}
              </option>
            ))}
          </select>
        </ExerciseCountDifficultyWrapper>
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
      {safeCount > 0 && <GetButton onClick={getWorkout}>Get</GetButton>}
    </>
  );
}
