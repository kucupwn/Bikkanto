import styled, { keyframes } from "styled-components";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import {
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Check, Flag, RotateCcw, Shuffle, Bookmark } from "lucide-react";
import type { ViewModes } from "../../pages/Workout";
import { type ProperySelection } from "./WorkoutSettings";
import HistoryDatePicker from "./DatePicker";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { FlapText } from "../FlapText";
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

const Head = styled.div`
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) 9.5rem 6.5rem 40px;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  border-bottom: 1px solid var(--board-line);
  font-family: var(--font-board);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber);

  > :nth-child(4) {
    text-align: right;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const lampOn = keyframes`
  from { background-color: rgba(255, 176, 0, 0.16); }
  to { background-color: transparent; }
`;

/* A row that lands or changes lights up like a board row being updated. */
const Row = styled.li`
  animation: ${lampOn} 1.1s var(--ease-out);
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) 9.5rem 6.5rem 40px;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--board-line);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 700px) {
    grid-template-columns: 2.25rem minmax(0, 1fr) auto;
    grid-template-areas:
      "no name reps"
      "no tier reroll";
    gap: 0.25rem 0.75rem;
    padding: 1rem;

    > :nth-child(1) { grid-area: no; align-self: start; }
    > :nth-child(2) { grid-area: name; }
    > :nth-child(3) { grid-area: tier; }
    > :nth-child(4) { grid-area: reps; }
    > :nth-child(5) { grid-area: reroll; justify-self: end; }
  }
`;

const No = styled.span`
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  color: var(--board-ink-2);
  font-variant-numeric: tabular-nums;
`;

const Name = styled.div`
  min-width: 0;
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.2;

  small {
    display: block;
    margin-top: 2px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: var(--track);
    color: var(--board-ink-2);
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

const Tier = styled.span`
  font-family: var(--font-board);
  font-size: 15px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--board-ink-2);

  b {
    color: var(--board-ink);
    font-weight: 600;
  }
`;

const Reps = styled.div`
  justify-self: end;
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

const Rows = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
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
}: Props) {
  const { showRibbon } = useRibbon();

  function resetWorkout() {
    setWorkout(null);
    setMode("settings");
    setHasAcceptedWorkout(false);
    setTitle("Create a workout");
  }

  async function acceptWorkout() {
    if (!workout?.length) return;

    try {
      const res = await api.post("/history/draft", workout);
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
        <Head aria-hidden="true">
          <span>No</span>
          <span>Exercise</span>
          <span>Tier</span>
          <span>Reps</span>
          <span />
        </Head>
        <Rows>
          {entries.map((entry, index) => (
            <Row key={`${index}-${entry.exercise_id}`}>
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
              </Tier>
              <Reps>
                <FlapText
                  text={entry.reps}
                  cells
                  size="lg"
                  pad={2}
                  animateOnMount
                  delay={index * 90 + 120}
                  tone="amber"
                />
              </Reps>
              {!hasAcceptedWorkout ? (
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
            <Button $variant="primary" onClick={acceptWorkout}>
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
            <Button $block disabled title="Presets are coming soon">
              <Bookmark size={18} aria-hidden="true" />
              Save to presets
            </Button>
          </LogStack>
        </Panel>
      )}
    </Layout>
  );
}
