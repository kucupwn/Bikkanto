import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import type { ModalType } from "../../pages/Exercises";
import { Loader } from "../Loader";
import { DataTable } from "../DataTable";
import { CategoryModal } from "./CategoryModal";
import { FullExerciseModal } from "./FullExerciseModal";
import type { Category, Exercise } from "../../types/exerciseTypes";
import { Board, Button } from "../ui";
import { FlapText } from "../FlapText";

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Count = styled.span`
  font-family: var(--font-board);
  font-size: 14px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--ink-2);
`;

export const EmptyState = styled(Board)`
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  p {
    color: var(--board-ink-2);
    max-width: 52ch;
  }
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
  const hasExercises = exercises.length > 0;
  const hasCategories = categories.length > 0;

  return (
    <>
      <Toolbar>
        <Button
          $variant="primary"
          onClick={() => setActiveModal("add")}
          disabled={!hasCategories}
          title={hasCategories ? undefined : "Add a category first"}
        >
          <Plus size={18} aria-hidden="true" />
          Add exercise
        </Button>
        <Button
          onClick={() => setActiveModal("edit")}
          disabled={!hasExercises}
        >
          <Pencil size={16} aria-hidden="true" />
          Edit
        </Button>
        <Button
          $variant="danger"
          onClick={() => setActiveModal("delete")}
          disabled={!hasExercises}
        >
          <Trash2 size={16} aria-hidden="true" />
          Delete
        </Button>
        <Button $variant="ghost" onClick={() => setActiveModal("category")}>
          <Tags size={16} aria-hidden="true" />
          Categories
        </Button>
        <Spacer />
        {!isLoading && (
          <Count>
            {exercises.length} exercises · {categories.length} categories
          </Count>
        )}
      </Toolbar>

      {isLoading && <Loader />}
      {!isLoading && hasExercises && (
        <DataTable data={exercises} columns={columns} />
      )}
      {!isLoading && !hasExercises && (
        <EmptyState>
          <FlapText text="No exercises" cells size="md" tone="muted" />
          {hasCategories ? (
            <p>
              Add your first exercise, like diamond push up, with easy,
              medium and hard rep ranges that fit your level.
            </p>
          ) : (
            <p>
              Start with categories such as push up, pull up or handstand.
              Exercises go inside a category.
            </p>
          )}
          <Button
            $variant="primary"
            onClick={() => setActiveModal(hasCategories ? "add" : "category")}
          >
            <Plus size={18} aria-hidden="true" />
            {hasCategories ? "Add exercise" : "Add a category"}
          </Button>
        </EmptyState>
      )}

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
