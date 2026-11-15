import { useEffect, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Category, Exercise } from "../../types/exerciseTypes";
import { api } from "../../api/api";
import { capitalize } from "../../utils";
import { DataTable, RowActionButton, type Column } from "../DataTable";
import { FlapText } from "../FlapText";
import { Loader } from "../Loader";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { EmptyState } from "./OwnExerciseTable";
import { FullExerciseModal } from "./FullExerciseModal";
import { MissingCategoryModal } from "./MissingCategoryModal";

interface Props {
  exercises: Exercise[];
  categories: Category[];
  onFetchCategories: () => Promise<void>;
  columns: Column[];
  isLoading: boolean;
}

export function PoolExerciseTable({
  exercises,
  categories,
  onFetchCategories,
  columns,
  isLoading,
}: Props) {
  // The user's own library, to mark pool rows they already have and to
  // block duplicate names in the add modal.
  const [ownExercises, setOwnExercises] = useState<Exercise[]>([]);
  // Pool row waiting on a category decision.
  const [pendingRow, setPendingRow] = useState<Exercise | null>(null);
  // Prefilled values for the add modal; null while it's closed.
  const [draft, setDraft] = useState<Exercise | null>(null);

  const { showRibbon } = useRibbon();

  async function fetchOwnExercises() {
    try {
      const res = await api.get<Exercise[]>("/exercises");
      setOwnExercises(res.data);
    } catch {
      showRibbon("error", "Could not fetch your exercises.");
    }
  }

  useEffect(() => {
    fetchOwnExercises();
  }, []);

  const ownNames = useMemo(
    () => new Set(ownExercises.map((ex) => ex.exercise_name)),
    [ownExercises],
  );

  function findCategory(name: string, list: Category[] = categories) {
    return list.find(
      (cat) => cat.category_name.toLowerCase() === name.toLowerCase(),
    );
  }

  function openAddModal(row: Exercise, category: Category | undefined) {
    setPendingRow(null);
    setDraft({
      exercise_name: row.exercise_name,
      difficulty: row.difficulty,
      easy_min: row.easy_min,
      easy_max: row.easy_max,
      medium_min: row.medium_min,
      medium_max: row.medium_max,
      hard_min: row.hard_min,
      hard_max: row.hard_max,
      category_id: category?.id ?? 0,
      category_name: category?.category_name ?? "",
    });
  }

  function handleAddClick(row: Exercise) {
    const category = findCategory(row.category_name);
    if (category) openAddModal(row, category);
    else setPendingRow(row);
  }

  async function handleAddMissingCategory() {
    if (!pendingRow) return;
    try {
      const res = await api.post<Category>("/exercises/categories", {
        category_name: pendingRow.category_name.toLowerCase(),
      });
      await onFetchCategories();
      showRibbon("success", "Category successfully added.");
      openAddModal(pendingRow, res.data);
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Category could not be added.";
      showRibbon("error", message);
    }
  }

  if (isLoading) return <Loader />;

  if (exercises.length === 0) {
    return (
      <EmptyState>
        <FlapText text="Pool empty" cells size="md" tone="muted" />
        <p>No shared exercises yet.</p>
      </EmptyState>
    );
  }

  return (
    <>
      <DataTable
        data={exercises}
        columns={columns}
        rowKey="exercise_name"
        rowActionLabel="Add to my exercises"
        renderRowAction={(row) => {
          const ex = row as Exercise;
          const name = capitalize(ex.exercise_name);
          return ownNames.has(ex.exercise_name) ? (
            <RowActionButton
              type="button"
              disabled
              aria-label={`${name} is already in your exercises`}
              title="Already in your exercises"
            >
              <Check size={16} aria-hidden="true" />
            </RowActionButton>
          ) : (
            <RowActionButton
              type="button"
              onClick={() => handleAddClick(ex)}
              aria-label={`Add ${name} to my exercises`}
              title="Add to my exercises"
            >
              <Plus size={16} aria-hidden="true" />
            </RowActionButton>
          );
        }}
      />

      {pendingRow && (
        <MissingCategoryModal
          categoryName={pendingRow.category_name}
          exerciseName={pendingRow.exercise_name}
          hasOwnCategories={categories.length > 0}
          onAddCategory={handleAddMissingCategory}
          onChooseOwn={() => openAddModal(pendingRow, categories[0])}
          onClose={() => setPendingRow(null)}
        />
      )}

      <FullExerciseModal
        isOpen={draft !== null}
        onClose={() => setDraft(null)}
        exercises={ownExercises}
        categories={categories}
        mode="add"
        initialExercise={draft ?? undefined}
        onSuccess={fetchOwnExercises}
      />
    </>
  );
}
