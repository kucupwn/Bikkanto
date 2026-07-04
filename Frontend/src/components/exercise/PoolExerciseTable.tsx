import type { Exercise } from "../../types/exerciseTypes";
import { DataTable } from "../DataTable";
import { Loader } from "../Loader";

interface Props {
  exercises: Exercise[];
  columns: any[];
  isLoading: boolean;
}

export function PoolExerciseTable({ exercises, columns, isLoading }: Props) {
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && <DataTable data={exercises} columns={columns} />}
    </>
  );
}
