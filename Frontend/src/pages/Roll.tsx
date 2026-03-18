import styled from "styled-components";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  type Category,
  type ExerciseRepetitionDifficulty,
  type Exercise,
} from "../types/exerciseTypes";
import { WorkoutSettings } from "../components/roll/WorkoutSettings";

const RollContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number | "">("");
  const [exerciseCountDifficulty, setExerciseCountDifficulty] =
    useState<ExerciseRepetitionDifficulty>("easy");
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

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
        <WorkoutSettings
          exerciseCount={exerciseCount}
          setExerciseCount={setExerciseCount}
          categories={categories}
        />
      </RollContainer>
    </>
  );
}
