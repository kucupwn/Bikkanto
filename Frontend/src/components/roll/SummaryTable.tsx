import styled from "styled-components";
import type { WorkoutEntry } from "../../types/exerciseTypes";

interface Props {
  workout: WorkoutEntry[];
}

const WorkoutTable = styled.table`
  margin: 1rem;
`;

export function SummaryTable({ workout }: Props) {
  return (
    <WorkoutTable border={2}>
      <thead>
        <tr>
          <th>Exercise Name</th>
          <th>Exercise Difficulty</th>
          <th>Reps Difficulty</th>
          <th>Reps</th>
        </tr>
      </thead>

      <tbody>
        {workout.map((entry, index) => (
          <tr key={index}>
            <td>{entry.exercise_name}</td>
            <td>{entry.difficulty}</td>
            <td>{entry.reps_difficulty}</td>
            <td>{entry.reps}</td>
          </tr>
        ))}
      </tbody>
    </WorkoutTable>
  );
}
