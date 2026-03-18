import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../api/api";
import { EXERCISE_COLUMNS_ORDER, type Exercises } from "../types/exerciseTypes";
import { capitalize } from "../utils";

export function Exercises() {
  const [data, setData] = useState<Exercises[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await api.get("/exercises");
        const exercises = res.data;

        setData(exercises);

        if (exercises.length > 0) {
          const cols = EXERCISE_COLUMNS_ORDER.map((key) => ({
            data: key,
            title: capitalize(key).replace("_", " "),
          }));
          setColumns(cols);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchExercises();
  }, []);

  return (
    <>
      <h1>Exercises</h1>
      <DataTable data={data} columns={columns} />
    </>
  );
}
