import styled from "styled-components";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import {
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ViewModes } from "../../pages/Workout";
import { type ProperySelection } from "./WorkoutSettings";
import HistoryDatePicker from "./DatePicker";
import { api } from "../../api/api";

const WorkoutTable = styled.table`
  margin: 1rem;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  vertical-align: center;
`;

const Cell = styled.td`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  vertical-align: center;
`;

const RerollCell = styled.td`
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  margin: 1rem;
  padding: 0.5rem 1rem;
`;

const CyclesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface Props {
  workout: WorkoutEntry[] | null;
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  hasAcceptedWorkout: boolean;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
  setCycles: Dispatch<SetStateAction<number | "">>;
  onPostFinishedWorkout: () => Promise<void>;
  isFinished: boolean;
  selectedProperties: ProperySelection[];
  onGetRandomExercise: (
    selectedProps: ProperySelection,
    usedIds: Set<number>,
  ) => WorkoutEntry | null;
  workoutDate: Date | null;
  setWorkoutDate: Dispatch<SetStateAction<Date | null>>;
  setTitle: Dispatch<SetStateAction<string | null>>;
}

export function SummaryTable({
  workout,
  setWorkout,
  setMode,
  hasAcceptedWorkout,
  setHasAcceptedWorkout,
  setCycles,
  onPostFinishedWorkout,
  isFinished,
  selectedProperties,
  onGetRandomExercise,
  workoutDate,
  setWorkoutDate,
  setTitle,
}: Props) {
  function resetWorkout() {
    setWorkout(null);
    setMode("settings");
    setHasAcceptedWorkout(false);
    setTitle("Create a workout");
  }

  async function acceptWorkout() {
    if (!workout?.length) return;

    const res = await api.post("/history/draft", workout);
    // Re-set for session_id (backend returns WorkoutDraftRead model)
    setWorkout(res.data);
    setHasAcceptedWorkout(true);
    setTitle("Have fun with the workout!");
  }

  function handleCyclesInputChange(e: ChangeEvent<HTMLInputElement>) {
    setCycles(Number(e.target.value));
  }

  function handleReroll(index: number) {
    if (!workout) return;

    const usedIds = new Set(workout.map((entry) => entry.exercise_id));

    const selectedProp = selectedProperties[index];
    const newExercise = onGetRandomExercise(selectedProp, usedIds);

    if (!newExercise) {
      return;
    }

    const updatedWorkout = [...workout];
    updatedWorkout[index] = newExercise;

    setWorkout(updatedWorkout);
  }

  useEffect(() => {
    async function getWorkoutDraft() {
      try {
        const res = await api.get("/history/draft");

        if (res.data.length > 0) {
          setTitle("Have fun with the workout!");
        } else {
          setTitle("Accept workout, if You like it.");
        }
      } catch (err: any) {
        console.error("Could not fetch workout draft.");
      }
    }

    getWorkoutDraft();
  }, []);

  return (
    <>
      {!isFinished && (
        <WorkoutTable>
          <thead>
            <tr>
              <TableHeader>Exercise Name</TableHeader>
              <TableHeader>Exercise Difficulty</TableHeader>
              <TableHeader>Reps Difficulty</TableHeader>
              <TableHeader>Reps</TableHeader>
            </tr>
          </thead>

          <tbody>
            {workout!.map((entry, index) => (
              <tr key={index}>
                <Cell>{entry.exercise_name}</Cell>
                <Cell>{entry.difficulty}</Cell>
                <Cell>{entry.reps_difficulty}</Cell>
                <Cell>{entry.reps}</Cell>
                <RerollCell onClick={() => handleReroll(index)}>
                  Reroll
                </RerollCell>
              </tr>
            ))}
          </tbody>
        </WorkoutTable>
      )}
      {!hasAcceptedWorkout && (
        <ButtonWrapper>
          <Button onClick={resetWorkout}>Restart</Button>
          <Button onClick={acceptWorkout}>Accept</Button>
        </ButtonWrapper>
      )}
      {hasAcceptedWorkout && !isFinished && (
        <CyclesWrapper>
          <input
            type="number"
            placeholder="Finished cycles"
            onChange={handleCyclesInputChange}
          />
          <HistoryDatePicker
            workoutDate={workoutDate}
            setWorkoutDate={setWorkoutDate}
          />
          <Button onClick={onPostFinishedWorkout}>Finish</Button>
        </CyclesWrapper>
      )}
      {isFinished && <h2>Good job! Workout saved.</h2>}
    </>
  );
}
