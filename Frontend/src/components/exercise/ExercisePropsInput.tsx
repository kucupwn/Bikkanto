import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  type Category,
  type Exercise,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import type { ChangeEvent } from "react";
import { Field, FieldLabel, Input, Select } from "../ui";

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

const Ranges = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;

  legend {
    padding: 0;
    margin-bottom: 0.5rem;
  }
`;

const RangeGrid = styled.div`
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.5rem 0.75rem;
  align-items: center;
`;

const ColHead = styled.span`
  font-size: 13px;
  color: var(--ink-3);
`;

const RowHead = styled.span`
  font-family: var(--font-board);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
`;

interface Props {
  exercise: Exercise;
  categories: Category[];
  onHandleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const levels = ["easy", "medium", "hard"] as const;

export function ExercisePropsInput({
  exercise,
  categories,
  onHandleChange,
}: Props) {
  return (
    <>
      <TwoCol>
        <Field>
          <FieldLabel>Category</FieldLabel>
          <Select
            name="category_id"
            value={exercise.category_id}
            onChange={onHandleChange}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {capitalize(cat.category_name)}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <FieldLabel>Difficulty</FieldLabel>
          <Select
            name="difficulty"
            value={exercise.difficulty}
            onChange={onHandleChange}
          >
            {exerciseDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {capitalize(diff)}
              </option>
            ))}
          </Select>
        </Field>
      </TwoCol>

      <Ranges>
        <legend>
          <FieldLabel>Rep ranges</FieldLabel>
        </legend>
        <RangeGrid>
          <span />
          <ColHead>Min reps</ColHead>
          <ColHead>Max reps</ColHead>
          {levels.map((level) => (
            <RangeRow
              key={level}
              level={level}
              exercise={exercise}
              onHandleChange={onHandleChange}
            />
          ))}
        </RangeGrid>
      </Ranges>
    </>
  );
}

function RangeRow({
  level,
  exercise,
  onHandleChange,
}: {
  level: (typeof levels)[number];
  exercise: Exercise;
  onHandleChange: Props["onHandleChange"];
}) {
  const minKey = `${level}_min` as const;
  const maxKey = `${level}_max` as const;

  return (
    <>
      <RowHead>{level}</RowHead>
      <Input
        name={minKey}
        type="number"
        min={0}
        inputMode="numeric"
        aria-label={`${capitalize(level)} min reps`}
        value={exercise[minKey]}
        onChange={onHandleChange}
      />
      <Input
        name={maxKey}
        type="number"
        min={0}
        inputMode="numeric"
        aria-label={`${capitalize(level)} max reps`}
        value={exercise[maxKey]}
        onChange={onHandleChange}
      />
    </>
  );
}
