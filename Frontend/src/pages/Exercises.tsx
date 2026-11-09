import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import {
  EXERCISE_COLUMNS_ORDER,
  POOL_EXERCISE_COLUMNS_ORDER,
  type Category,
  type Exercise,
  type WorkoutEntry,
} from "../types/exerciseTypes";
import type { WorkoutLocationState } from "./Workout";
import { PresetList } from "../components/presets/PresetList";
import { Loader } from "../components/Loader";
import { Plus } from "lucide-react";
import { capitalize } from "../utils";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { OwnExerciseTable } from "../components/exercise/OwnExerciseTable";
import { PoolExerciseTable } from "../components/exercise/PoolExerciseTable";
import {
  Button,
  Page,
  PageHeader,
  PageLede,
  PageTitle,
  SegmentButton,
  Segmented,
  Toolbar,
} from "../components/ui";

type ExercisesView = "own" | "pool" | "presets" | null;
export type ModalType = "category" | "add" | "edit" | "delete" | null;

export function Exercises() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<ExercisesView>("own");
  // Workout in progress; null until fetched for the presets tab
  const [draft, setDraft] = useState<WorkoutEntry[] | null>(null);

  const { showRibbon } = useRibbon();
  const navigate = useNavigate();

  function openWorkout(state: WorkoutLocationState) {
    navigate("/workout", { state });
  }

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

      // Presets need the own library for their reps ranges
      if (activeTable === "own" || activeTable === "presets") {
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

  async function fetchDraft() {
    try {
      const res = await api.get<WorkoutEntry[]>("/history/draft");
      setDraft(res.data);
    } catch {
      showRibbon("error", "Could not fetch workout draft.");
      setDraft([]);
    }
  }

  useEffect(() => {
    fetchExercises();
    fetchCategories();
    if (activeTable === "presets") fetchDraft();
  }, [activeTable]);

  const hasDraft = !!draft && draft.length > 0;

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Exercises</PageTitle>
          <PageLede>
            {activeTable === "pool"
              ? "Every exercise shared across Bikkanto, with how many athletes use it."
              : activeTable === "presets"
                ? "Workouts you saved. Open one to see, edit or delete it."
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
            aria-selected={activeTable === "presets"}
            $active={activeTable === "presets"}
            onClick={() => setActiveTable("presets")}
          >
            My presets
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
      {activeTable === "presets" && (
        <Toolbar>
          <Button
            $variant="primary"
            onClick={() => openWorkout({ create: true, creationMode: "preset" })}
          >
            <Plus size={18} aria-hidden="true" />
            Create preset
          </Button>
        </Toolbar>
      )}
      {activeTable === "presets" &&
        (draft === null ? (
          <Loader />
        ) : (
          <PresetList
            exercises={exercises}
            inProgressPresetId={hasDraft ? (draft[0].preset_id ?? null) : null}
            onDraftDiscarded={() => setDraft([])}
          />
        ))}
    </Page>
  );
}
