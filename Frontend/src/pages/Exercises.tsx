import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../api/api";
import { EXERCISE_COLUMNS_ORDER, type Exercise } from "../types/exerciseTypes";
import { capitalize } from "../utils";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  margin: 1rem;
  padding: 0.5rem 0;
  width: 80px;
`;

export function Exercises() {
  const [data, setData] = useState<Exercise[]>([]);
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
      <ButtonWrapper>
        <Button>Category</Button>
        <Button>Add</Button>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </ButtonWrapper>
      <DataTable data={data} columns={columns} />
    </>
  );
}
