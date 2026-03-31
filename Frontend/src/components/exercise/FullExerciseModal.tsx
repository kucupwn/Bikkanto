import styled from "styled-components";
import {
  type Exercise,
  type Category,
  exerciseDifficultyOptions,
} from "../../types/exerciseTypes";
import { useState, type ChangeEvent } from "react";
import { capitalize } from "../../utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  categories: Category[];
  mode: "add" | "edit";
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

export function FullExerciseModal({
  isOpen,
  onClose,
  exercises,
  categories,
  mode,
}: Props) {
  if (!isOpen) return null;

  const [exercise, setExercise] = useState<Exercise>(
    mode === "edit"
      ? exercises[0]
      : {
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
        },
  );

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === "exercise_id" && mode === "edit") {
      const selected = exercises.find((ex) => ex.id === Number(value));
      if (selected) {
        setExercise(selected);
      }
      return;
    }

    setExercise((prev) => {
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

  function handleSubmitExercise() {
    if (mode === "add") {
      const existing = exercises.find(
        (ex) => ex.exercise_name === exercise.exercise_name.toLowerCase(),
      );

      if (existing) {
        console.error(`${exercise.exercise_name} already exists.`);
        return;
      } else {
        console.log(exercise);
      }
    } else {
      console.log(exercise);
    }

    onClose();
  }

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>Edit exercise</Title>
        {mode === "edit" ? (
          <select
            name="exercise_id"
            value={exercise.exercise_name}
            onChange={handleChange}
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {capitalize(ex.exercise_name)}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="exercise_name"
            type="text"
            placeholder="Exercise name..."
            value={exercise.exercise_name}
            onChange={handleChange}
          />
        )}
        <ExercisePropsContainer>
          <InputWrapper>
            <span>Category</span>
            <select
              name="category_id"
              value={exercise.category_id}
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
              value={exercise.difficulty}
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
              value={exercise.easy_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Easy max reps</span>
            <input
              name="easy_max"
              type="number"
              value={exercise.easy_max}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Medium min reps</span>
            <input
              name="medium_min"
              type="number"
              value={exercise.medium_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Medium max reps</span>
            <input
              name="medium_max"
              type="number"
              value={exercise.medium_max}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Hard min reps</span>
            <input
              name="hard_min"
              type="number"
              value={exercise.hard_min}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <span>Hard max reps</span>
            <input
              name="hard_max"
              type="number"
              value={exercise.hard_max}
              onChange={handleChange}
            />
          </InputWrapper>
        </ExercisePropsContainer>
        <Button onClick={handleSubmitExercise}>Submit</Button>
      </ModalBox>
    </Overlay>
  );
}
