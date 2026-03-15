import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../api/api";

export function Exercises() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await api.get("/exercises");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchExercises();
  }, []);

  return (
    <>
      <h1>Exercises</h1>
      <DataTable data={data} />
    </>
  );
}
