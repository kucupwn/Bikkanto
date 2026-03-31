import styled from "styled-components";
import { type Exercise, type Category } from "../../types/exerciseTypes";
import { useState, type ChangeEvent } from "react";
import { capitalize } from "../../utils";
import { ExercisePropsInput } from "./ExercisePropsInput";

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
        <ExercisePropsInput
          exercise={exercise}
          categories={categories}
          onHandleChange={handleChange}
        />
        <Button onClick={handleSubmitExercise}>Submit</Button>
      </ModalBox>
    </Overlay>
  );
}
