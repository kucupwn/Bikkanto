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
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";

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
  const [workout, setWorkout] = useState<WorkoutEntry[] | null>(null);
  const [hasAcceptedWorkout, setHasAcceptedWorkout] = useState<boolean>(false);
  const [mode, setMode] = useState<ViewModes>("settings");
  const [cycles, setCycles] = useState<number | "">("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [workoutDate, setWorkoutDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState<string | null>(null);
  const { showRibbon } = useRibbon();

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
      showRibbon(
        "error",
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
    if (!workout || !workoutDate) return null;

    return workout.map((entry) => ({
      date_complete: workoutDate.toISOString().split("T")[0],
      exercise_id: entry.exercise_id,
      category_id: entry.category_id,
      difficulty: entry.difficulty,
      reps_difficulty: entry.reps_difficulty,
      cycles: safeCycles,
      reps: entry.reps,
      sum_repetitions: entry.reps * safeCycles,
    }));
  }

  async function postFinishedWorkout() {
    if (safeCycles <= 0) return;

    const historyEntries = getHistoryEntries();

    if (!historyEntries) return;

    await api.post("/history", historyEntries);
    showRibbon("success", "Workout saved to history.");

    setIsFinished(true);

    // Will need to add time for safety
    if (workout) {
      await api.delete(`/history/draft/${workout[0].session_id}`);
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api("/exercises/categories");
        const categories = res.data;

        setCategories(categories);
      } catch (err) {
        showRibbon("error", "Could not fetch exercises.");
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
        showRibbon("error", "Could not fetch categories.");
      }
    }

    fetchExercises();
  }, []);

  useEffect(() => {
    async function getWorkoutDraft() {
      try {
        const res = await api.get("/history/draft");

        if (res.data.length > 0) {
          setWorkout(res.data);
          setHasAcceptedWorkout(true);
          setMode("stored");
        }
      } catch (err) {
        showRibbon("error", "Could not fetch workout draft.");
      }
    }

    getWorkoutDraft();
  }, []);

  useEffect(() => {
    if (mode === "stored") {
      setTitle(null);
    } else {
      setTitle("Create a workout");
    }
  }, []);

  return (
    <RollContainer>
      {!isFinished && <h2>{title}</h2>}
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
          setTitle={setTitle}
        />
      )}

      {mode === "stored" && (
        <StoredWorkout
          workout={workout}
          setWorkout={setWorkout}
          setMode={setMode}
          setHasAcceptedWorkout={setHasAcceptedWorkout}
          setTitle={setTitle}
        />
      )}
    </RollContainer>
  );
}
