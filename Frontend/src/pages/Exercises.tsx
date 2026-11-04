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
import { PoolExerciseTable } from "../components/exercise/PoolExerciseTable";
import {
  Page,
  PageHeader,
  PageLede,
  PageTitle,
  SegmentButton,
  Segmented,
} from "../components/ui";

type ExercisesView = "own" | "pool" | null;
export type ModalType = "category" | "add" | "edit" | "delete" | null;

export function Exercises() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<ExercisesView>("own");

  const { showRibbon } = useRibbon();

  const columns = useMemo(() => {
    const columnOrder =
      activeTable === "pool"
        ? POOL_EXERCISE_COLUMNS_ORDER
        : EXERCISE_COLUMNS_ORDER;

    // Names are stored lowercase; capitalize them for display only.
    const textColumns = new Set(["exercise_name", "category_name", "difficulty"]);

    return columnOrder.map((key) => ({
      data: key,
      title: capitalize(key).replace("_", " "),
      ...(textColumns.has(key) && { className: "htCenter bk-cap" }),
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
      const message = err.response?.data?.detail || "Could not fetch exercises.";
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
      const message = err.response?.data?.detail || "Could not fetch categories.";
      showRibbon("error", message);
    }
  }

  useEffect(() => {
    fetchExercises();
    fetchCategories();
  }, [activeTable]);

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Exercises</PageTitle>
          <PageLede>
            {activeTable === "pool"
              ? "Every exercise shared across Bikkanto, with how many athletes use it."
              : "Your library. Rep ranges here decide what a rolled workout asks of you."}
          </PageLede>
        </div>
        <Segmented role="tablist" aria-label="Table view">
          <SegmentButton
            role="tab"
            aria-selected={activeTable === "own"}
            $active={activeTable === "own"}
            onClick={() => setActiveTable("own")}
          >
            My exercises
          </SegmentButton>
          <SegmentButton
            role="tab"
            aria-selected={activeTable === "pool"}
            $active={activeTable === "pool"}
            onClick={() => setActiveTable("pool")}
          >
            Pool
          </SegmentButton>
        </Segmented>
      </PageHeader>

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
    </Page>
  );
}
