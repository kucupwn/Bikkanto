import styled from "styled-components";
import type { WorkoutEntry } from "../../types/exerciseTypes";

interface Props {
  workout: WorkoutEntry[];
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

export function SummaryTable({ workout }: Props) {
  return (
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
        {workout.map((entry, index) => (
          <tr key={index}>
            <Cell>{entry.exercise_name}</Cell>
            <Cell>{entry.difficulty}</Cell>
            <Cell>{entry.reps_difficulty}</Cell>
            <Cell>{entry.reps}</Cell>
          </tr>
        ))}
      </tbody>
    </WorkoutTable>
  );
}
