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
import { SummaryTable } from "../components/roll/SummaryTable";
import { StoredWorkout } from "../components/roll/StoredWorkout";
import type { WorkoutHistory } from "../types/historyTypes";

const RollContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export type ViewModes = "settings" | "preview" | "stored";

export function Roll() {
  const [exerciseCount, setExerciseCount] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [selectedProperties, setSelectedProperties] = useState<
    ProperySelection[]
  >([]);
  const [workout, setWorkout] = useState<WorkoutEntry[] | null>(() => {
    const stored = localStorage.getItem("workout");
    return stored ? JSON.parse(stored) : null;
  });
  const [hasAcceptedWorkout, setHasAcceptedWorkout] = useState<boolean>(
    workout !== null,
  );
  const [mode, setMode] = useState<ViewModes>(workout ? "stored" : "settings");
  const [cycles, setCycles] = useState<number | "">("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [workoutDate, setWorkoutDate] = useState<Date | null>(new Date());

  const safeCycles = typeof cycles == "number" ? cycles : 0;

  function getRandomExercise(
    selectedProp: ProperySelection,
    usedIds: Set<number>,
  ): WorkoutEntry | null {
    const filtered = exercises.filter(
      (ex) =>
        ex.category_id === selectedProp.categoryId &&
        ex.difficulty === selectedProp.exerciseDifficulty &&
        !usedIds.has(ex.id!),
    );

    if (filtered.length === 0) {
      const [missingCategory] = categories.filter(
        (cat) => cat.id === selectedProp.categoryId,
      );
      console.error(
        `There is no or not enough ${selectedProp.exerciseDifficulty.toUpperCase()} ${missingCategory.category_name.toUpperCase()}`,
      );

      return null;
    }

    const exercise = filtered[Math.floor(Math.random() * filtered.length)];

    const minKey = `${selectedProp.repsDifficulty}_min` as keyof Exercise;
    const maxKey = `${selectedProp.repsDifficulty}_max` as keyof Exercise;

    const minRep = exercise[minKey] as number;
    const maxRep = exercise[maxKey] as number;

    const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

    return {
      exercise_id: exercise.id!,
      exercise_name: exercise.exercise_name,
      category_id: exercise.category_id,
      category_name: exercise.category_name,
      difficulty: exercise.difficulty,
      reps_difficulty: selectedProp.repsDifficulty,
      reps,
    };
  }

  function getWorkout() {
    const usedExerciseIds = new Set<number>();

    const rolledWorkout: WorkoutEntry[] = selectedProperties
      .map((exc) => {
        const exercise = getRandomExercise(exc, usedExerciseIds);

        if (exercise) {
          usedExerciseIds.add(exercise.exercise_id);
        }

        return exercise;
      })
      .filter((entry): entry is WorkoutEntry => entry !== null);

    if (rolledWorkout.length !== selectedProperties.length) {
      return;
    } else {
      setWorkout(rolledWorkout);
      setMode("preview");
    }
  }

  function getHistoryEntries(): WorkoutHistory[] | null {
    if (workout === null || workoutDate === null) return null;

    return workout.map((entry) => ({
      date_complete: workoutDate.toISOString().split("T")[0],
      exercise_id: entry.exercise_id,
      exercise_name: entry.exercise_name,
      category_id: entry.category_id,
      category_name: entry.category_name,
      difficulty: entry.difficulty,
      reps_difficulty: entry.reps_difficulty,
      cycles: safeCycles,
      repetitions: entry.reps,
      sum_repetitions: entry.reps * safeCycles,
    }));
  }

  function postFinishedWorkout() {
    if (safeCycles <= 0) return;

    const historyEntries = getHistoryEntries();

    if (!historyEntries) return;

    api.post("/history", historyEntries);

    setIsFinished(true);
    localStorage.removeItem("workout");
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
        {mode === "settings" && (
          <WorkoutSettings
            exerciseCount={exerciseCount}
            setExerciseCount={setExerciseCount}
            categories={categories}
            selectedProperties={selectedProperties}
            setSelectedProperties={setSelectedProperties}
            onGetWorkout={getWorkout}
          />
        )}
        {mode === "preview" && (
          <SummaryTable
            workout={workout}
            setWorkout={setWorkout}
            setMode={setMode}
            hasAcceptedWorkout={hasAcceptedWorkout}
            setHasAcceptedWorkout={setHasAcceptedWorkout}
            setCycles={setCycles}
            onPostFinishedWorkout={postFinishedWorkout}
            isFinished={isFinished}
            selectedProperties={selectedProperties}
            onGetRandomExercise={getRandomExercise}
            workoutDate={workoutDate}
            setWorkoutDate={setWorkoutDate}
          />
        )}

        {mode === "stored" && (
          <StoredWorkout
            setWorkout={setWorkout}
            setMode={setMode}
            setHasAcceptedWorkout={setHasAcceptedWorkout}
          />
        )}
      </RollContainer>
    </>
  );
}
