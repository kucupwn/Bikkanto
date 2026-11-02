import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import { Minus, Plus, Shuffle } from "lucide-react";
import {
  exerciseDifficultyOptions,
  repsDifficultyOptions,
  type Category,
  type Exercise,
  type ExerciseDifficulty,
  type RepsDifficulty,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import { ExerciseSelection } from "./ExerciseSelection";
import type { WorkoutCreationType } from "../../pages/Workout";
import { InfoTooltip } from "../InfoTooltip";
import {
  Button,
  Field,
  FieldLabel,
  Panel,
  SectionTitle,
  SegmentButton,
  Segmented,
  Select,
} from "../ui";

const ModeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

const Stepper = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--control);
  overflow: hidden;

  &:focus-within {
    border-color: var(--focus);
    box-shadow: 0 0 0 1px var(--focus);
  }

  button {
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    color: var(--ink-2);

    &:hover:not(:disabled) {
      background: var(--control-hover);
      color: var(--ink);
    }

    &:disabled {
      opacity: 0.35;
    }
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    border-inline: 1px solid var(--line-soft);
    background: transparent;
    text-align: center;
    font-family: var(--font-board);
    font-size: 20px;
    font-weight: 700;
    appearance: textfield;
    -moz-appearance: textfield;

    &:focus {
      outline: none;
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const Rows = styled.ol`
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
`;

const Empty = styled.p`
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-2);
`;

const RollBar = styled.div`
  margin-top: 1.25rem;

  @media (max-width: 900px) {
    position: sticky;
    bottom: calc(var(--tabbar-h) + 0.75rem);
    z-index: 5;
  }
`;

export interface ProperySelection {
  categoryId: number;
  exerciseId?: number;
  exerciseDifficulty: ExerciseDifficulty;
  repsDifficulty: RepsDifficulty;
}

type GlobalPropertyType = "exercise" | "reps";

const MAX_COUNT = 100;

interface Props {
  exerciseCount: number | "";
  setExerciseCount: Dispatch<SetStateAction<number | "">>;
  categories: Category[];
  exercises: Exercise[];
  selectedProperties: ProperySelection[];
  setSelectedProperties: Dispatch<SetStateAction<ProperySelection[]>>;
  workoutCreationMode: WorkoutCreationType;
  setWorkoutCreationMode: Dispatch<SetStateAction<WorkoutCreationType>>;
  onGetWorkout: () => void;
  hasWorkout: boolean;
}

export function WorkoutSettings({
  exerciseCount,
  setExerciseCount,
  categories,
  exercises,
  selectedProperties,
  setSelectedProperties,
  workoutCreationMode,
  setWorkoutCreationMode,
  onGetWorkout,
  hasWorkout,
}: Props) {
  const safeCount = typeof exerciseCount == "number" ? exerciseCount : 0;
  const globalExerciseDifficulty = getGlobalDifficulty("exercise");
  const globalRepsDifficulty = getGlobalDifficulty("reps");

  function applyExerciseCount(currentValue: number) {
    if (currentValue <= 0) {
      setExerciseCount("");
      setSelectedProperties([]);
    } else {
      setExerciseCount(currentValue);
      setSelectedProperties((prev) => {
        const newArray = Array.from({ length: currentValue }, (_, index) => {
          return (
            prev[index] ?? {
              categoryId: categories[0]?.id ?? 0,
              exerciseId:
                exercises.find(
                  (exc) =>
                    exc.category_id === categories[0]?.id &&
                    exc.difficulty === "beginner",
                )?.id ?? 0,
              exerciseDifficulty: "beginner",
              repsDifficulty: "easy",
            }
          );
        });
        return newArray;
      });
    }
  }

  function handleExerciseCountChange(e: ChangeEvent<HTMLInputElement>) {
    applyExerciseCount(Math.min(Number(e.target.value), MAX_COUNT));
  }

  function updatePropertyAtIndex(index: number, newValue: ProperySelection) {
    setSelectedProperties((prev) => {
      const copy = [...prev];
      copy[index] = newValue;
      return copy;
    });
  }

  function getGlobalDifficulty(type: GlobalPropertyType) {
    const first =
      type === "exercise"
        ? selectedProperties[0]?.exerciseDifficulty
        : selectedProperties[0]?.repsDifficulty;

    const allSame = selectedProperties.every((item) => {
      if (type === "exercise") {
        return item.exerciseDifficulty === first;
      } else {
        return item.repsDifficulty === first;
      }
    });

    return allSame ? first : "custom";
  }

  function setGlobalPropertySettings(
    type: GlobalPropertyType,
    value: ExerciseDifficulty | RepsDifficulty,
  ) {
    setSelectedProperties((prev) =>
      prev.map((item) => ({
        ...item,
        ...(type === "exercise"
          ? { exerciseDifficulty: value as ExerciseDifficulty }
          : { repsDifficulty: value as RepsDifficulty }),
      })),
    );
  }

  return (
    <Panel aria-labelledby="build-title">
      <SectionTitle id="build-title">Build</SectionTitle>
      <ModeRow>
        <Segmented role="radiogroup" aria-label="Creation mode">
          <SegmentButton
            role="radio"
            aria-checked={workoutCreationMode === "random"}
            $active={workoutCreationMode === "random"}
            onClick={() => setWorkoutCreationMode("random")}
          >
            Random
          </SegmentButton>
          <SegmentButton
            role="radio"
            aria-checked={workoutCreationMode === "preset"}
            $active={workoutCreationMode === "preset"}
            onClick={() => setWorkoutCreationMode("preset")}
          >
            Preset
          </SegmentButton>
        </Segmented>
        <InfoTooltip
          label="About creation modes"
          text={
            <>
              <strong>Random</strong> picks exercises for you from your
              chosen category, difficulty and reps difficulty.
              <br />
              <br />
              <strong>Preset</strong> lets you choose each exercise yourself;
              category and difficulty filter the list.
            </>
          }
        />
      </ModeRow>

      {workoutCreationMode === null ? (
        <Empty>Choose Random or Preset to start building.</Empty>
      ) : (
        <>
          <Grid>
            <Field as="div" style={{ gridColumn: "1 / -1" }}>
              <FieldLabel id="count-label">Exercises</FieldLabel>
              <Stepper>
                <button
                  type="button"
                  aria-label="One fewer exercise"
                  disabled={safeCount <= 0}
                  onClick={() => applyExerciseCount(safeCount - 1)}
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <input
                  type="number"
                  aria-labelledby="count-label"
                  inputMode="numeric"
                  min={0}
                  max={MAX_COUNT}
                  placeholder="0"
                  value={exerciseCount}
                  onChange={handleExerciseCountChange}
                />
                <button
                  type="button"
                  aria-label="One more exercise"
                  disabled={safeCount >= MAX_COUNT}
                  onClick={() => applyExerciseCount(safeCount + 1)}
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </Stepper>
            </Field>
            <Field>
              <FieldLabel>Difficulty, all rows</FieldLabel>
              <Select
                name="exercise-difficulty"
                value={globalExerciseDifficulty ?? ""}
                disabled={safeCount === 0}
                onChange={(e) =>
                  setGlobalPropertySettings(
                    "exercise",
                    e.target.value as ExerciseDifficulty,
                  )
                }
              >
                {exerciseDifficultyOptions.map((diff) => (
                  <option key={diff} value={diff}>
                    {capitalize(diff)}
                  </option>
                ))}
                <option key="custom" value="custom" disabled>
                  Mixed
                </option>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Reps, all rows</FieldLabel>
              <Select
                name="reps-difficulty"
                value={globalRepsDifficulty ?? ""}
                disabled={safeCount === 0}
                onChange={(e) =>
                  setGlobalPropertySettings(
                    "reps",
                    e.target.value as RepsDifficulty,
                  )
                }
              >
                {repsDifficultyOptions.map((diff) => (
                  <option key={diff} value={diff}>
                    {capitalize(diff)}
                  </option>
                ))}
                <option key="custom" value="custom" disabled>
                  Mixed
                </option>
              </Select>
            </Field>
          </Grid>

          {safeCount > 0 ? (
            <Rows aria-label="Exercises">
              {Array.from({ length: safeCount }).map((_, index) => (
                <ExerciseSelection
                  key={index}
                  currentCount={index + 1}
                  categories={categories}
                  exercises={exercises}
                  value={selectedProperties[index]}
                  onChange={(newValue) =>
                    updatePropertyAtIndex(index, newValue)
                  }
                  workoutCreationMode={workoutCreationMode}
                />
              ))}
            </Rows>
          ) : (
            <Empty>
              {categories.length === 0
                ? "You have no categories yet. Add some on the Exercises page first."
                : "Add exercises with the + button, then set each row."}
            </Empty>
          )}

          {safeCount > 0 && (
            <RollBar>
              <Button
                $variant="primary"
                $size="lg"
                $block
                onClick={onGetWorkout}
              >
                <Shuffle size={20} aria-hidden="true" />
                {hasWorkout ? "Roll again" : "Roll workout"}
              </Button>
            </RollBar>
          )}
        </>
      )}
    </Panel>
  );
}
