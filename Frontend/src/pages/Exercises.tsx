import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../api/api";

export function Exercises() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await api.get("/exercises");
        const exercises = res.data;

        setData(exercises);

        if (exercises.length > 0) {
          const cols = Object.keys(exercises[0]).map((key) => ({
            data: key,
            title: (key.charAt(0).toUpperCase() + key.slice(1)).replace(
              "_",
              " ",
            ),
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
      <DataTable data={data} colHeaders={columns} columns={columns} />
    </>
  );
}
