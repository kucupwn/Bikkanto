import type { Exercise } from "../../types/exerciseTypes";
import { DataTable } from "../DataTable";
import { FlapText } from "../FlapText";
import { Loader } from "../Loader";
import { EmptyState } from "./OwnExerciseTable";

interface Props {
  exercises: Exercise[];
  columns: any[];
  isLoading: boolean;
}

export function PoolExerciseTable({ exercises, columns, isLoading }: Props) {
  if (isLoading) return <Loader />;

  if (exercises.length === 0) {
    return (
      <EmptyState>
        <FlapText text="Pool empty" cells size="md" tone="muted" />
        <p>No shared exercises yet.</p>
      </EmptyState>
    );
  }

  return <DataTable data={exercises} columns={columns} />;
}
