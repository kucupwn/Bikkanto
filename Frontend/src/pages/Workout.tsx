import styled from "styled-components";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  type Category,
  type Exercise,
  type WorkoutEntry,
  type WorkoutOrigin,
} from "../types/exerciseTypes";
import type { Preset } from "../types/presetTypes";
import { SelectedPresetPanel } from "../components/workout/SelectedPresetPanel";
import {
  WorkoutSettings,
  type ProperySelection,
} from "../components/workout/WorkoutSettings";
import { SummaryTable } from "../components/workout/SummaryTable";
import { StoredWorkout } from "../components/workout/StoredWorkout";
import { PresetList } from "../components/presets/PresetList";
import type { WorkoutHistoryCreate } from "../types/historyTypes";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Bookmark, History, Shuffle } from "lucide-react";
import { FlapText } from "../components/FlapText";
import {
  Board,
  BoardHead,
  BoardNote,
  BoardTitle,
  Button,
  Page,
  PageHeader,
  PageLede,
  PageTitle,
} from "../components/ui";

const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;

  > :last-child {
    position: sticky;
    top: 1.5rem;
  }

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);

    > :last-child {
      position: static;
    }
  }
`;

const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  max-width: 880px;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Choice = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 200px;
  padding: 1.75rem;
  text-align: left;
  background: var(--board);
  color: var(--board-ink);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  transition: border-color 0.15s ease;

  svg {
    color: var(--amber);
  }

  p {
    color: var(--board-ink-2);
    max-width: 36ch;
  }

  span:last-child {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-board);
    font-weight: 600;
    letter-spacing: var(--track);
    text-transform: uppercase;
    color: var(--amber);
  }

  &:hover {
    border-color: var(--amber);
  }

  &:hover span:last-child svg {
    transform: translateX(3px);
  }

  span:last-child svg {
    transition: transform 0.2s var(--ease-out);
  }
`;

const ChoiceTitle = styled.span`
  font-family: var(--font-board);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const EmptyBoard = styled(Board)`
  min-height: 320px;
  display: flex;
  flex-direction: column;
`;

const EmptyBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1.25rem;

  p {
    color: var(--board-ink-2);
    max-width: 44ch;
  }
`;

const Done = styled(Board)`
  max-width: 720px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  p {
    color: var(--board-ink-2);
  }
`;

const BoardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const BoardGhost = styled(Button)`
  background: transparent;
  color: var(--board-ink);
  border-color: var(--board-line);
  text-decoration: none;

  &:hover:not(:disabled) {
    background: var(--board-cell);
    border-color: var(--board-ink-2);
  }
`;

const ledes: Record<string, string> = {
  null: "Roll a new workout from your library, or start from a saved preset.",
  settings: "Set how many exercises and how hard, then roll.",
  preview: "Reroll any row you don't like, then accept.",
  presetPreview: "Adjust the reps if you like, then accept.",
  accepted: "Train through it, then log how many cycles you finished.",
  stored: "You have a workout waiting to be logged.",
  select: "Start from a workout you saved earlier.",
};

export type ViewModes = "settings" | "preview" | "stored" | "select" | null;
export type WorkoutCreationType = "random" | "preset" | null;

// Lets other pages (e.g. the presets tab on Exercises) open the workout flow
// at the create settings.
export type WorkoutLocationState = { create: true } | null;

export function Workout() {
  const [exerciseCount, setExerciseCount] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<
    ProperySelection[]
  >([]);
  const [workoutCreationMode, setWorkoutCreationMode] =
    useState<WorkoutCreationType>("random");
  const [workout, setWorkout] = useState<WorkoutEntry[] | null>(null);
  const [hasAcceptedWorkout, setHasAcceptedWorkout] = useState<boolean>(false);
  const [mode, setMode] = useState<ViewModes>(null);
  const [cycles, setCycles] = useState<number | "">("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [workoutDate, setWorkoutDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const { showRibbon } = useRibbon();
  const location = useLocation();
  const navigate = useNavigate();

  const safeCycles = typeof cycles == "number" ? cycles : 0;
  const origin: WorkoutOrigin = selectedPreset
    ? "preset"
    : workoutCreationMode === "preset"
      ? "custom"
      : "random";

  // Copies the preset's rows into a fresh workout; reps edits never touch the
  // saved preset.
  function selectPreset(preset: Preset) {
    setSelectedPreset(preset);
    setWorkout(
      preset.exercises.map((entry) => ({
        exercise_id: entry.exercise_id,
        exercise_name: entry.exercise_name,
        category_id: entry.category_id,
        category_name: entry.category_name,
        difficulty: entry.difficulty,
        reps_difficulty: entry.reps_difficulty,
        reps: entry.reps,
      })),
    );
    setHasAcceptedWorkout(false);
    setMode("preview");
  }

  function backToPresets() {
    setSelectedPreset(null);
    setWorkout(null);
    setHasAcceptedWorkout(false);
    setMode("select");
  }

  function openCreate() {
    setSelectedPreset(null);
    setMode("settings");
  }

  function getRandomExercise(
    selectedProp: ProperySelection,
    usedIds: Set<number>,
  ): WorkoutEntry | null {
    const filtered = exercises.filter(
      (ex) =>
        ex.category_id === selectedProp.categoryId &&
        ex.difficulty === selectedProp.exerciseDifficulty &&
        !usedIds.has(ex.id!),
    );

    if (filtered.length === 0) {
      const [missingCategory] = categories.filter(
        (cat) => cat.id === selectedProp.categoryId,
      );
      showRibbon(
        "error",
        `There is no or not enough ${selectedProp.exerciseDifficulty.toUpperCase()} ${missingCategory.category_name.toUpperCase()}`,
      );

      return null;
    }

    const exercise = filtered[Math.floor(Math.random() * filtered.length)];

    const minKey = `${selectedProp.repsDifficulty}_min` as keyof Exercise;
    const maxKey = `${selectedProp.repsDifficulty}_max` as keyof Exercise;

    const minRep = exercise[minKey] as number;
    const maxRep = exercise[maxKey] as number;

    const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

    return {
      exercise_id: exercise.id!,
      exercise_name: exercise.exercise_name,
      category_id: exercise.category_id,
      category_name: exercise.category_name,
      difficulty: exercise.difficulty,
      reps_difficulty: selectedProp.repsDifficulty,
      reps,
    };
  }

  function getPresetExercise(
    selectedProp: ProperySelection,
  ): WorkoutEntry | null {
    const exercise = exercises.find(
      (ex) =>
        ex.id === selectedProp.exerciseId &&
        ex.category_id === selectedProp.categoryId,
    );

    if (!exercise) {
      showRibbon("error", "Selected exercise could not be found.");
      return null;
    }

    const minKey = `${selectedProp.repsDifficulty}_min` as keyof Exercise;
    const maxKey = `${selectedProp.repsDifficulty}_max` as keyof Exercise;

    const minRep = exercise[minKey] as number;
    const maxRep = exercise[maxKey] as number;

    const reps = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;

    return {
      exercise_id: exercise.id!,
      exercise_name: exercise.exercise_name,
      category_id: exercise.category_id,
      category_name: exercise.category_name,
      difficulty: exercise.difficulty,
      reps_difficulty: selectedProp.repsDifficulty,
      reps,
    };
  }

  function getWorkout() {
    const usedExerciseIds = new Set<number>();

    const rolledWorkout: WorkoutEntry[] = selectedProperties
      .map((selectedProp) => {
        if (workoutCreationMode === "preset") {
          return getPresetExercise(selectedProp);
        }

        const exercise = getRandomExercise(selectedProp, usedExerciseIds);

        if (exercise) {
          usedExerciseIds.add(exercise.exercise_id);
        }

        return exercise;
      })
      .filter((entry): entry is WorkoutEntry => entry !== null);

    if (rolledWorkout.length !== selectedProperties.length) {
      return;
    }

    setWorkout(rolledWorkout);
    setMode("preview");
  }

  function getHistoryEntries(): WorkoutHistoryCreate[] | null {
    if (!workout || !workoutDate) return null;

    return workout.map((entry) => ({
      date_complete: workoutDate.toISOString().split("T")[0],
      exercise_id: entry.exercise_id,
      reps_difficulty: entry.reps_difficulty,
      cycles: safeCycles,
      reps: entry.reps,
    }));
  }

  async function postFinishedWorkout() {
    if (safeCycles <= 0) return;

    const historyEntries = getHistoryEntries();

    if (!historyEntries) return;

    try {
      await api.post("/history", historyEntries);

      if (workout) {
        try {
          await api.delete(`/history/draft/${workout[0].session_id}`);
        } catch (err: any) {
          showRibbon("error", "Failed to delete workout from draft.");
        }
      }

      setIsFinished(true);
      showRibbon("success", "Workout saved to history.");
    } catch (err: any) {
      showRibbon("error", "Failed to save workout. Draft kept.");
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api("/exercises/categories");
        const categories = res.data;

        setCategories(categories);
      } catch (err) {
        showRibbon("error", "Could not fetch categories.");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await api("/exercises");
        const exercises = res.data;

        setExercises(exercises);
      } catch (err) {
        showRibbon("error", "Could not fetch exercises.");
      }
    }

    fetchExercises();
  }, []);

  useEffect(() => {
    async function getDraftWorkout() {
      try {
        const res = await api.get("/history/draft");

        if (res.data.length > 0) {
          setWorkout(res.data);
          setHasAcceptedWorkout(true);
          setMode("stored");
        }
      } catch (err) {
        showRibbon("error", "Could not fetch workout draft.");
      }
    }

    getDraftWorkout();
  }, []);

  useEffect(() => {
    setTitle("Start a workout");
  }, []);

  // Picks up a create request from another page, then clears it so a reload
  // or back navigation doesn't replay it.
  useEffect(() => {
    const state = location.state as WorkoutLocationState;
    if (!state) return;

    if (state.create) openCreate();

    navigate(location.pathname, { replace: true, state: null });
  }, []);

  useEffect(() => {
    if (mode === "settings") {
      setTitle("Create a workout");
    } else if (mode === "select") {
      setTitle("Select a workout");
    } else if (mode === null) {
      setTitle("Start a workout");
    }
  }, [mode]);

  function startAnother() {
    setSelectedPreset(null);
    setWorkout(null);
    setHasAcceptedWorkout(false);
    setIsFinished(false);
    setCycles("");
    setWorkoutDate(new Date());
    setMode("settings");
  }

  const showBuilder =
    !isFinished &&
    (mode === "settings" || (mode === "preview" && !hasAcceptedWorkout));

  const summary = (
    <SummaryTable
      workout={workout}
      setWorkout={setWorkout}
      setMode={setMode}
      hasAcceptedWorkout={hasAcceptedWorkout}
      setHasAcceptedWorkout={setHasAcceptedWorkout}
      cycles={cycles}
      setCycles={setCycles}
      onPostFinishedWorkout={postFinishedWorkout}
      selectedProperties={selectedProperties}
      onGetRandomExercise={getRandomExercise}
      workoutDate={workoutDate}
      setWorkoutDate={setWorkoutDate}
      setTitle={setTitle}
      workoutCreationMode={workoutCreationMode}
      origin={origin}
      presetId={selectedPreset?.id ?? null}
      onStartOver={selectedPreset ? backToPresets : undefined}
      exercises={exercises}
    />
  );

  const isPresetReview =
    !!selectedPreset && mode === "preview" && !hasAcceptedWorkout;

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{isFinished ? "Workout saved" : title}</PageTitle>
          {!isFinished && (
            <PageLede>
              {ledes[
                mode === "preview" && hasAcceptedWorkout
                  ? "accepted"
                  : mode === "preview" && origin !== "random"
                    ? "presetPreview"
                    : String(mode)
              ]}
            </PageLede>
          )}
        </div>
        {(mode === "settings" || mode === "select") && !isFinished && (
          <Button $variant="ghost" onClick={() => setMode(null)}>
            Back
          </Button>
        )}
        {isPresetReview && !isFinished && (
          <Button $variant="ghost" onClick={backToPresets}>
            Back
          </Button>
        )}
      </PageHeader>

      {isFinished && (
        <Done as="section">
          <FlapText text="Finished" cells size="lg" tone="amber" animateOnMount />
          <p>
            Good job. {workout?.length ?? 0} exercises ×{" "}
            {typeof cycles === "number" ? cycles : 0} cycles went into your
            history.
          </p>
          <BoardActions>
            <Button $variant="primary" onClick={startAnother}>
              <Shuffle size={18} aria-hidden="true" />
              Roll another
            </Button>
            <BoardGhost as={Link} to="/history">
              <History size={18} aria-hidden="true" />
              View history
            </BoardGhost>
          </BoardActions>
        </Done>
      )}

      {!isFinished && mode === null && (
        <Choices>
          <Choice onClick={openCreate}>
            <Shuffle size={28} aria-hidden="true" />
            <ChoiceTitle>Create</ChoiceTitle>
            <p>
              Roll random exercises by category and difficulty, or pick each
              one yourself.
            </p>
            <span>
              Build a workout <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Choice>
          <Choice onClick={() => setMode("select")}>
            <Bookmark size={28} aria-hidden="true" />
            <ChoiceTitle>Select</ChoiceTitle>
            <p>Start from a workout you saved as a preset.</p>
            <span>
              Browse presets <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Choice>
        </Choices>
      )}

      {!isFinished && mode === "select" && (
        <PresetList
          exercises={exercises}
          onCreate={openCreate}
          onSelect={selectPreset}
        />
      )}

      {showBuilder && (
        <Split>
          {selectedPreset ? (
            <SelectedPresetPanel preset={selectedPreset} />
          ) : (
            <WorkoutSettings
              exerciseCount={exerciseCount}
              setExerciseCount={setExerciseCount}
              categories={categories}
              exercises={exercises}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
              workoutCreationMode={workoutCreationMode}
              setWorkoutCreationMode={setWorkoutCreationMode}
              onGetWorkout={getWorkout}
              hasWorkout={mode === "preview"}
            />
          )}
          {mode === "preview" ? (
            summary
          ) : (
            <EmptyBoard as="section" aria-labelledby="empty-board-title">
              <BoardHead>
                <BoardTitle id="empty-board-title">Today's board</BoardTitle>
                <BoardNote>Waiting for a roll</BoardNote>
              </BoardHead>
              <EmptyBody>
                <FlapText text="Ready" cells size="lg" tone="muted" />
                <p>
                  Your rolled exercises and reps land here. You can reroll
                  single rows before you accept.
                </p>
              </EmptyBody>
            </EmptyBoard>
          )}
        </Split>
      )}

      {!isFinished && mode === "preview" && hasAcceptedWorkout && summary}

      {!isFinished && mode === "stored" && (
        <StoredWorkout
          workout={workout}
          setWorkout={setWorkout}
          setMode={setMode}
          setHasAcceptedWorkout={setHasAcceptedWorkout}
          setTitle={setTitle}
        />
      )}
    </Page>
  );
}
