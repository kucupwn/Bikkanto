import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  type Category,
  type Exercise,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import { useState, type ChangeEvent } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  categories: Category[];
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

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

const Button = styled.button`
  margin-top: 1rem;
`;

export function AddExerciseModal({
  isOpen,
  onClose,
  exercises,
  categories,
}: Props) {
  if (!isOpen) return null;

  const [newExercise, setNewExercise] = useState<Exercise>({
    exercise_name: "",
    difficulty: "beginner",
    easy_min: 1,
    easy_max: 1,
    medium_min: 1,
    medium_max: 1,
    hard_min: 1,
    hard_max: 1,
    category_id: categories[0]?.id ?? 0,
    category_name: categories[0]?.category_name ?? "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setNewExercise((prev) => {
      if (name === "category_id") {
        const selected = categories.find((cat) => cat.id === Number(value));
        return {
          ...prev,
          category_id: Number(value),
          category_name: selected?.category_name ?? "",
        };
      }

      return {
        ...prev,
        [name]: e.target.type === "number" ? Number(value) : value,
      };
    });
  }

  function handleAddExercise() {}

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>Add exercise</Title>
        <input
          name="exercise_name"
          type="text"
          placeholder="Exercise name..."
          value={newExercise.exercise_name}
          onChange={handleChange}
        />
        <ExercisePropsContainer>
          <InputWrapper>
            <span>Category</span>
            <select
              name="category_id"
              value={newExercise.category_id}
              onChange={handleChange}
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
              value={newExercise.difficulty}
              onChange={handleChange}
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
              value={newExercise.easy_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Easy max reps</span>
            <input
              name="easy_max"
              type="number"
              value={newExercise.easy_max}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Medium min reps</span>
            <input
              name="medium_min"
              type="number"
              value={newExercise.medium_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Medium max reps</span>
            <input
              name="medium_max"
              type="number"
              value={newExercise.medium_max}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Hard min reps</span>
            <input
              name="hard_min"
              type="number"
              value={newExercise.hard_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Hard max reps</span>
            <input
              name="hard_max"
              type="number"
              value={newExercise.hard_max}
              onChange={handleChange}
            />
          </InputWrapper>
        </ExercisePropsContainer>
        <Button>Add</Button>
      </ModalBox>
    </Overlay>
  );
}
