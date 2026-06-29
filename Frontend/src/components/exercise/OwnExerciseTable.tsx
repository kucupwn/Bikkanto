import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import type { ModalType } from "../../pages/Exercises";
import { Loader } from "../Loader";
import { DataTable } from "../DataTable";
import { CategoryModal } from "./CategoryModal";
import { FullExerciseModal } from "./FullExerciseModal";
import type { Category, Exercise } from "../../types/exerciseTypes";

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

interface Props {
  activeModal: ModalType;
  setActiveModal: Dispatch<SetStateAction<ModalType>>;
  exercises: Exercise[];
  categories: Category[];
  onFetchCategories: () => Promise<void>;
  onFetchExercises: () => Promise<void>;
  columns: any[];
  isLoading: boolean;
}

export function OwnExerciseTable({
  activeModal,
  setActiveModal,
  exercises,
  categories,
  onFetchCategories,
  onFetchExercises,
  columns,
  isLoading,
}: Props) {
  return (
    <>
      <ButtonWrapper>
        <Button onClick={() => setActiveModal("category")}>Category</Button>
        <Button onClick={() => setActiveModal("add")}>Add</Button>
        <Button onClick={() => setActiveModal("edit")}>Edit</Button>
        <Button onClick={() => setActiveModal("delete")}>Delete</Button>
      </ButtonWrapper>

      {isLoading && <Loader />}
      {!isLoading && <DataTable data={exercises} columns={columns} />}

      <CategoryModal
        isOpen={activeModal === "category"}
        onClose={() => setActiveModal(null)}
        categories={categories}
        onSuccess={onFetchCategories}
      />
      <FullExerciseModal
        isOpen={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"add"}
        onSuccess={onFetchExercises}
      />
      <FullExerciseModal
        isOpen={activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"edit"}
        onSuccess={onFetchExercises}
      />
      <FullExerciseModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        exercises={exercises}
        categories={categories}
        mode={"delete"}
        onSuccess={onFetchExercises}
      />
    </>
  );
}
