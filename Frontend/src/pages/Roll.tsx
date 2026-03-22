import styled from "styled-components";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  type Category,
  type Exercise,
  type WorkoutEntry,
} from "../types/exerciseTypes";
import {
  WorkoutSettings,
  type ProperySelection,
} from "../components/roll/WorkoutSettings";

const RollContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [selectedProperties, setSelectedProperties] = useState<
    ProperySelection[]
  >([]);

  function getRandomExercise(selectedProp: ProperySelection): WorkoutEntry {
    const filtered = exercises.filter(
      (ex) => ex.category_id === selectedProp.categoryId,
    );

    const exercise = filtered[Math.floor(Math.random() * filtered.length)];

    const minKey = `${selectedProp.repsDifficulty}_min` as keyof Exercise;
    const maxKey = `${selectedProp.repsDifficulty}_max` as keyof Exercise;

    const minRep = exercise[minKey] as number;
    const maxRep = exercise[maxKey] as number;

    const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

    return {
      exercise_id: exercise.id,
      exercise_name: exercise.exercise_name,
      category_id: exercise.category_id,
      category_name: exercise.category_name,
      difficulty: exercise.difficulty,
      reps_difficulty: selectedProp.repsDifficulty,
      reps,
    };
  }

  function getWorkout() {
    const workout = selectedProperties.map((exc) => getRandomExercise(exc));

    console.log(workout);
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
        <WorkoutSettings
          exerciseCount={exerciseCount}
          setExerciseCount={setExerciseCount}
          categories={categories}
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
          onGetWorkout={getWorkout}
        />
      </RollContainer>
    </>
  );
}
