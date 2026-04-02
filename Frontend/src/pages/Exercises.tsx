import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../api/api";
import {
  EXERCISE_COLUMNS_ORDER,
  type Category,
  type Exercise,
} from "../types/exerciseTypes";
import { capitalize } from "../utils";
import styled from "styled-components";
import { CategoryModal } from "../components/exercise/CategoryModal";
import { FullExerciseModal } from "../components/exercise/FullExerciseModal";

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

type ModalType = "category" | "add" | "edit" | "delete" | null;

export function Exercises() {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  async function fetchExercises() {
    try {
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
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api("/exercises/categories");
      const categories = res.data;

      setCategories(categories);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <ButtonWrapper>
        <Button onClick={() => setActiveModal("category")}>Category</Button>
        <Button onClick={() => setActiveModal("add")}>Add</Button>
        <Button onClick={() => setActiveModal("edit")}>Edit</Button>
        <Button onClick={() => setActiveModal("delete")}>Delete</Button>
      </ButtonWrapper>
      <DataTable data={exercises} columns={columns} />
      <CategoryModal
        isOpen={activeModal === "category"}
        onClose={() => setActiveModal(null)}
        categories={categories}
        onSuccess={fetchCategories}
      />
      <FullExerciseModal
        isOpen={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"add"}
        onSuccess={fetchExercises}
      />
      <FullExerciseModal
        isOpen={activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"edit"}
        onSuccess={fetchExercises}
      />
      <FullExerciseModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"delete"}
        onSuccess={fetchExercises}
      />
    </>
  );
}
