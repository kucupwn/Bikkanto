import { useState } from "react";
import styled from "styled-components";

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

type exerciseCountDifficulty = "easy" | "medium" | "hard";

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [exerciseCountDifficulty, setExerciseCountDifficulty] =
    useState<exerciseCountDifficulty>("easy");

  return (
    <>
      <WorkoutBasePropertiesWrapper>
        <ExerciseCountWrapper>
          <span>Exercise Count:</span>
          <input type="number" />
        </ExerciseCountWrapper>
        <ExerciseCountDifficultyWrapper>
          <span>Exercise Count Difficulty:</span>
          <select name="exercise-count-difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </ExerciseCountDifficultyWrapper>
      </WorkoutBasePropertiesWrapper>
    </>
  );
}
