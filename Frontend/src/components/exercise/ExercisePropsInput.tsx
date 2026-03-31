import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  type Category,
  type Exercise,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import type { ChangeEvent } from "react";

interface Props {
  exercise: Exercise;
  categories: Category[];
  onHandleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExercisePropsContainer = styled.div`
  display: grid;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

export function ExercisePropsInput({
  exercise,
  categories,
  onHandleChange,
}: Props) {
  return (
    <ExercisePropsContainer>
      <InputWrapper>
        <span>Category</span>
        <select
          name="category_id"
          value={exercise.category_id}
          onChange={onHandleChange}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {capitalize(cat.category_name)}
            </option>
          ))}
        </select>
      </InputWrapper>
      <InputWrapper>
        <span>Difficulty</span>
        <select
          name="difficulty"
          value={exercise.difficulty}
          onChange={onHandleChange}
        >
          {exerciseDifficultyOptions.map((diff) => (
            <option key={diff} value={diff}>
              {capitalize(diff)}
            </option>
          ))}
        </select>
      </InputWrapper>
      <InputWrapper>
        <span>Easy min reps</span>
        <input
          name="easy_min"
          type="number"
          value={exercise.easy_min}
          onChange={onHandleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <span>Easy max reps</span>
        <input
          name="easy_max"
          type="number"
          value={exercise.easy_max}
          onChange={onHandleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <span>Medium min reps</span>
        <input
          name="medium_min"
          type="number"
          value={exercise.medium_min}
          onChange={onHandleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <span>Medium max reps</span>
        <input
          name="medium_max"
          type="number"
          value={exercise.medium_max}
          onChange={onHandleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <span>Hard min reps</span>
        <input
          name="hard_min"
          type="number"
          value={exercise.hard_min}
          onChange={onHandleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <span>Hard max reps</span>
        <input
          name="hard_max"
          type="number"
          value={exercise.hard_max}
          onChange={onHandleChange}
        />
      </InputWrapper>
    </ExercisePropsContainer>
  );
}
