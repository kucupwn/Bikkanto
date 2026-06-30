import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  EXERCISE_COLUMNS_ORDER,
  type Category,
  type Exercise,
} from "../types/exerciseTypes";
import { capitalize } from "../utils";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { OwnExerciseTable } from "../components/exercise/OwnExerciseTable";
import styled from "styled-components";

const TableViewButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const TableViewButton = styled.button`
  font-size: 20px;
`;

type ExercisesView = "own" | "pool" | null;
export type ModalType = "category" | "add" | "edit" | "delete" | null;

export function Exercises() {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<ExercisesView>(null);
  const { showRibbon } = useRibbon();

  async function fetchExercises() {
    try {
      setIsLoading(true);

      const res = await api.get("/exercises");
      const exercises = res.data;

      setExercises(exercises);

      if (exercises.length > 0) {
        const cols = EXERCISE_COLUMNS_ORDER.map((key) => ({
          data: key,
          title: capitalize(key).replace("_", " "),
        }));
        setColumns(cols);
      }
    } catch (err: any) {
      const message = err.response.data.detail || "Could not fetch exercises.";
      showRibbon("error", message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api("/exercises/categories");
      const categories = res.data;

      setCategories(categories);
    } catch (err: any) {
      const message = err.response.data.detail || "Could not fetch categories.";
      showRibbon("error", message);
    }
  }

  useEffect(() => {
    fetchExercises();
    fetchCategories();
  }, []);

  return (
    <>
      <TableViewButtonContainer>
        <TableViewButton>Own</TableViewButton>
        <TableViewButton>Pool</TableViewButton>
      </TableViewButtonContainer>

      {activeTable === "own" && (
        <OwnExerciseTable
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          exercises={exercises}
          categories={categories}
          onFetchCategories={fetchCategories}
          onFetchExercises={fetchExercises}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
