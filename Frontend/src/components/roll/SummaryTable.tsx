import styled from "styled-components";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import { type Dispatch, type SetStateAction } from "react";
import type { ViewModes } from "../../pages/Roll";

interface Props {
  workout: WorkoutEntry[] | null;
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  hasAcceptedWorkout: boolean;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
}

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

const ButtonWrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  margin: 1rem;
  padding: 0.5rem 1rem;
`;

export function SummaryTable({
  workout,
  setWorkout,
  setMode,
  hasAcceptedWorkout,
  setHasAcceptedWorkout,
}: Props) {
  function resetWorkout() {
    setWorkout(null);
    setMode("settings");
    setHasAcceptedWorkout(false);
  }

  function acceptWorkout() {
    localStorage.setItem("workout", JSON.stringify(workout));
    setHasAcceptedWorkout(true);
  }

  return (
    <>
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
            </tr>
          ))}
        </tbody>
      </WorkoutTable>
      {!hasAcceptedWorkout && (
        <ButtonWrapper>
          <Button onClick={resetWorkout}>Restart</Button>
          <Button onClick={acceptWorkout}>Accept</Button>
        </ButtonWrapper>
      )}
    </>
  );
}
