import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import {
  EXERCISE_COLUMNS_ORDER,
  POOL_EXERCISE_COLUMNS_ORDER,
  type Category,
  type Exercise,
} from "../types/exerciseTypes";
import { capitalize } from "../utils";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { OwnExerciseTable } from "../components/exercise/OwnExerciseTable";
import styled from "styled-components";
import { PoolExerciseTable } from "../components/exercise/PoolExerciseTable";

const TableViewButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const TableViewButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const TableViewButton = styled.button`
  font-size: 20px;
`;

type ExercisesView = "own" | "pool" | null;
export type ModalType = "category" | "add" | "edit" | "delete" | null;

export function Exercises() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<ExercisesView>(null);
  const { showRibbon } = useRibbon();

  const columns = useMemo(() => {
    const columnOrder =
      activeTable === "pool"
        ? POOL_EXERCISE_COLUMNS_ORDER
        : EXERCISE_COLUMNS_ORDER;

    return columnOrder.map((key) => ({
      data: key,
      title: capitalize(key).replace("_", " "),
    }));
  }, [activeTable]);

  async function fetchExercises() {
    try {
      setIsLoading(true);

      let fetchedExercises: Exercise[] = [];

      if (activeTable === "own") {
        const res = await api.get("/exercises");
        fetchedExercises = res.data;
      } else if (activeTable === "pool") {
        const res = await api.get("/exercises/pool");
        fetchedExercises = res.data;
      } else return;

      setExercises(fetchedExercises);
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
  }, [activeTable]);

  return (
    <>
      <TableViewButtonContainer>
        <h2>Table view:</h2>
        <TableViewButtonWrapper>
          <TableViewButton onClick={() => setActiveTable("own")}>
            Own
          </TableViewButton>
          <TableViewButton onClick={() => setActiveTable("pool")}>
            Pool
          </TableViewButton>
        </TableViewButtonWrapper>
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
      {activeTable === "pool" && (
        <PoolExerciseTable
          columns={columns}
          exercises={exercises}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
