import styled from "styled-components";
import type {
  Exercise,
  WorkoutEntry,
  WorkoutOrigin,
} from "../../types/exerciseTypes";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Check,
  Flag,
  RotateCcw,
  Shuffle,
  Bookmark,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import type { ViewModes, WorkoutCreationType } from "../../pages/Workout";
import { type ProperySelection } from "./WorkoutSettings";
import HistoryDatePicker from "./DatePicker";
import { PresetNameModal } from "../presets/PresetNameModal";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { FlapText } from "../FlapText";
import {
  Head,
  Name,
  No,
  Reps,
  RepsStepper,
  Row,
  Rows,
  Tier,
} from "../BoardRows";
import { getRepsDifficulty } from "../../utils";
import {
  Board,
  BoardHead,
  BoardNote,
  BoardTitle,
  Button,
  Field,
  FieldLabel,
  Input,
  Panel,
  SectionTitle,
} from "../ui";

const Layout = styled.div<{ $withLog: boolean }>`
  display: grid;
  grid-template-columns: ${({ $withLog }) =>
    $withLog ? "minmax(0, 1fr) 320px" : "minmax(0, 1fr)"};
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Reroll = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  background: transparent;
  color: var(--board-ink-2);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: var(--amber);
    border-color: var(--amber);
  }

  &:hover svg {
    transform: rotate(-90deg);
  }

  svg {
    transition: transform 0.3s var(--ease-out);
  }
`;

const BoardFoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--board-line);

  @media (max-width: 700px) {
    > * {
      flex: 1;
    }
  }
`;

const BoardGhost = styled(Button)`
  background: transparent;
  color: var(--board-ink);
  border-color: var(--board-line);

  &:hover:not(:disabled) {
    background: var(--board-cell);
    border-color: var(--board-ink-2);
  }
`;

const LogStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Hint = styled.p`
  color: var(--ink-2);
  font-size: 14px;
`;

/* A disabled button gets no hover events, so the tooltip sits on a wrapper. */
const TooltipWrap = styled.span`
  display: block;

  button:disabled {
    pointer-events: none;
  }
`;

interface Props {
  workout: WorkoutEntry[] | null;
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  hasAcceptedWorkout: boolean;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
  cycles: number | "";
  setCycles: Dispatch<SetStateAction<number | "">>;
  onPostFinishedWorkout: () => Promise<void>;
  selectedProperties: ProperySelection[];
  onGetRandomExercise: (
    selectedProps: ProperySelection,
    usedIds: Set<number>,
  ) => WorkoutEntry | null;
  workoutDate: Date | null;
  setWorkoutDate: Dispatch<SetStateAction<Date | null>>;
  setTitle: Dispatch<SetStateAction<string | null>>;
  workoutCreationMode: WorkoutCreationType;
  origin: WorkoutOrigin;
  presetId: number | null;
  // Replaces the default "back to Create" reset, e.g. back to the preset list
  onStartOver?: () => void;
  exercises: Exercise[];
}

export function SummaryTable({
  workout,
  setWorkout,
  setMode,
  hasAcceptedWorkout,
  setHasAcceptedWorkout,
  cycles,
  setCycles,
  onPostFinishedWorkout,
  selectedProperties,
  onGetRandomExercise,
  workoutDate,
  setWorkoutDate,
  setTitle,
  workoutCreationMode,
  origin,
  presetId,
  onStartOver,
  exercises,
}: Props) {
  const { showRibbon } = useRibbon();
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);

  function resetWorkout() {
    if (onStartOver) {
      onStartOver();
      return;
    }

    setWorkout(null);
    setMode("settings");
    setHasAcceptedWorkout(false);
    setTitle("Create a workout");
  }

  async function discardWorkout() {
    if (!workout?.length) return;

    try {
      await api.delete(`/history/draft/${workout[0].session_id}`);

      setWorkout(null);
      setMode(null);
      setHasAcceptedWorkout(false);
      setCycles("");
      setWorkoutDate(new Date());
      setTitle("Start a workout");
    } catch {
      showRibbon("error", "Could not delete workout draft.");
    }
  }

  async function acceptWorkout() {
    if (!workout?.length) return;

    try {
      const res = await api.post(
        "/history/draft",
        workout.map((entry) => ({
          ...entry,
          origin,
          preset_id: origin === "preset" ? presetId : null,
        })),
      );
      // Re-set for session_id (backend returns DraftWorkoutRead model)
      setWorkout(res.data);
      setHasAcceptedWorkout(true);
      setTitle("Workout in progress");
    } catch {
      showRibbon("error", "Could not accept the workout. Try again.");
    }
  }

  function handleCyclesInputChange(e: ChangeEvent<HTMLInputElement>) {
    setCycles(e.target.value === "" ? "" : Number(e.target.value));
  }

  function getExercise(entry: WorkoutEntry) {
    return exercises.find((ex) => ex.id === entry.exercise_id);
  }

  function getRepsRange(entry: WorkoutEntry) {
    const exercise = getExercise(entry);
    if (!exercise) return null;

    const min = exercise[`${entry.reps_difficulty}_min`];
    const max = exercise[`${entry.reps_difficulty}_max`];

    return `${min}-${max}`;
  }

  function getMinReps(entry: WorkoutEntry) {
    return getExercise(entry)?.easy_min ?? 1;
  }

  function setRepsAtIndex(index: number, reps: number) {
    if (!workout) return;

    const updatedWorkout = [...workout];
    const entry = updatedWorkout[index];
    const exercise = getExercise(entry);
    updatedWorkout[index] = {
      ...entry,
      reps,
      reps_difficulty: exercise
        ? getRepsDifficulty(exercise, reps)
        : entry.reps_difficulty,
    };

    setWorkout(updatedWorkout);
  }

  function handleRepsChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    setRepsAtIndex(index, e.target.value === "" ? 0 : Number(e.target.value));
  }

  // Typing is left free so multi-digit counts can pass through low values;
  // the floor is enforced once the field loses focus.
  function handleRepsBlur(index: number, entry: WorkoutEntry) {
    const minReps = getMinReps(entry);
    if (entry.reps < minReps) setRepsAtIndex(index, minReps);
  }

  function handleReroll(index: number) {
    if (!workout) return;

    const usedIds = new Set(workout.map((entry) => entry.exercise_id));

    const selectedProp = selectedProperties[index];
    if (!selectedProp) return;

    const newExercise = onGetRandomExercise(selectedProp, usedIds);

    if (!newExercise) {
      return;
    }

    const updatedWorkout = [...workout];
    updatedWorkout[index] = newExercise;

    setWorkout(updatedWorkout);
  }

  useEffect(() => {
    async function getDraftWorkout() {
      try {
        const res = await api.get("/history/draft");

        if (res.data.length > 0) {
          setTitle("Workout in progress");
        } else {
          setTitle("Review your roll");
        }
      } catch {
        console.error("Could not fetch workout draft.");
      }
    }

    getDraftWorkout();
  }, []);

  const entries = workout ?? [];
  // Read from the saved draft so these still hold after Resume
  const draftOrigin = entries[0]?.origin;
  const isAlreadyPreset = draftOrigin === "preset";
  const isPreset =
    workoutCreationMode === "preset" ||
    origin === "preset" ||
    draftOrigin === "preset" ||
    draftOrigin === "custom";
  const canEditReps = !hasAcceptedWorkout;
  const withReroll = !isPreset;
  const canAccept =
    entries.length > 0 && entries.every((e) => e.reps >= getMinReps(e));
  const canFinish = typeof cycles === "number" && cycles > 0 && !!workoutDate;

  return (
    <Layout $withLog={hasAcceptedWorkout}>
      <Board as="section" aria-labelledby="board-title">
        <BoardHead>
          <BoardTitle id="board-title">Today's board</BoardTitle>
          <BoardNote>
            {entries.length} {entries.length === 1 ? "exercise" : "exercises"}
            {hasAcceptedWorkout ? " · accepted" : " · not accepted"}
          </BoardNote>
        </BoardHead>
        <Head aria-hidden="true" $withReroll={withReroll}>
          <span>No</span>
          <span>Exercise</span>
          <span>Tier</span>
          <span>Reps</span>
          {withReroll && <span />}
        </Head>
        <Rows>
          {entries.map((entry, index) => (
            <Row
              key={`${index}-${entry.exercise_id}`}
              $withReroll={withReroll}
            >
              <No>{String(index + 1).padStart(2, "0")}</No>
              <Name>
                <FlapText
                  text={entry.exercise_name ?? ""}
                  animateOnMount
                  delay={index * 90}
                />
                {entry.category_name && <small>{entry.category_name}</small>}
              </Name>
              <Tier>
                <b>{entry.difficulty}</b> · {entry.reps_difficulty}
                {(isPreset || canEditReps) &&
                  getRepsRange(entry) &&
                  ` (${getRepsRange(entry)})`}
              </Tier>
              <Reps>
                {canEditReps ? (
                  <RepsStepper>
                    <button
                      type="button"
                      aria-label={`Fewer reps for exercise ${index + 1}`}
                      disabled={entry.reps <= getMinReps(entry)}
                      onClick={() => setRepsAtIndex(index, entry.reps - 1)}
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={getMinReps(entry)}
                      aria-label={`Reps for exercise ${index + 1}`}
                      value={entry.reps || ""}
                      onChange={(e) => handleRepsChange(index, e)}
                      onBlur={() => handleRepsBlur(index, entry)}
                    />
                    <button
                      type="button"
                      aria-label={`More reps for exercise ${index + 1}`}
                      onClick={() => setRepsAtIndex(index, entry.reps + 1)}
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </RepsStepper>
                ) : (
                  <FlapText
                    text={entry.reps}
                    cells
                    size="lg"
                    pad={2}
                    animateOnMount
                    delay={index * 90 + 120}
                    tone="amber"
                  />
                )}
              </Reps>
              {!withReroll ? null : !hasAcceptedWorkout ? (
                <Reroll
                  onClick={() => handleReroll(index)}
                  aria-label={`Reroll exercise ${index + 1}`}
                  title="Reroll this exercise"
                >
                  <Shuffle size={18} aria-hidden="true" />
                </Reroll>
              ) : (
                <span />
              )}
            </Row>
          ))}
        </Rows>
        {!hasAcceptedWorkout && (
          <BoardFoot>
            <BoardGhost onClick={resetWorkout}>
              <RotateCcw size={18} aria-hidden="true" />
              Start over
            </BoardGhost>
            <Button
              $variant="primary"
              onClick={acceptWorkout}
              disabled={!canAccept}
            >
              <Check size={18} aria-hidden="true" />
              Accept workout
            </Button>
          </BoardFoot>
        )}
      </Board>

      {hasAcceptedWorkout && (
        <Panel aria-labelledby="log-title">
          <SectionTitle id="log-title">Log this workout</SectionTitle>
          <LogStack>
            <Hint>
              Your workout is saved as a draft until you finish it, even if
              you log out.
            </Hint>
            <Field>
              <FieldLabel>Finished cycles</FieldLabel>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 3"
                value={cycles}
                onChange={handleCyclesInputChange}
              />
            </Field>
            <Field as="div">
              <FieldLabel>Date</FieldLabel>
              <HistoryDatePicker
                workoutDate={workoutDate}
                setWorkoutDate={setWorkoutDate}
              />
            </Field>
            <Button
              $variant="primary"
              $size="lg"
              $block
              onClick={onPostFinishedWorkout}
              disabled={!canFinish}
            >
              <Flag size={18} aria-hidden="true" />
              Finish and save
            </Button>
            <TooltipWrap
              title={isAlreadyPreset ? "It is already a preset" : undefined}
            >
              <Button
                $block
                onClick={() => setIsPresetModalOpen(true)}
                disabled={isAlreadyPreset}
              >
                <Bookmark size={18} aria-hidden="true" />
                Save to presets
              </Button>
            </TooltipWrap>
            <Button $variant="danger" $block onClick={discardWorkout}>
              <Trash2 size={18} aria-hidden="true" />
              Discard workout
            </Button>
          </LogStack>
        </Panel>
      )}

      <PresetNameModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        workout={entries}
      />
    </Layout>
  );
}
