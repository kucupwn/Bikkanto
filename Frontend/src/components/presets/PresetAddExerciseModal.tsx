import { useMemo, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";
import { ModalBase } from "../ModalBase";
import { Button, Field, FieldLabel, Select } from "../ui";
import { capitalize } from "../../utils";
import {
  exerciseDifficultyOptions,
  type Exercise,
} from "../../types/exerciseTypes";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* Category and difficulty share a row; on phones each takes its own. */
const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ANY = "";

interface Props {
  exercises: Exercise[];
  // Exercises already in the preset; they are left out of the list
  usedIds: Set<number>;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
}

export function PresetAddExerciseModal({
  exercises,
  usedIds,
  onClose,
  onAdd,
}: Props) {
  const [categoryId, setCategoryId] = useState<string>(ANY);
  const [difficulty, setDifficulty] = useState<string>(ANY);
  const [exerciseId, setExerciseId] = useState<string>("");

  const categories = useMemo(() => {
    const byId = new Map<number, string>();
    for (const ex of exercises) byId.set(ex.category_id, ex.category_name);
    return [...byId]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises]);

  const options = exercises
    .filter(
      (ex) =>
        ex.id !== undefined &&
        !usedIds.has(ex.id) &&
        (categoryId === ANY || ex.category_id === Number(categoryId)) &&
        (difficulty === ANY || ex.difficulty === difficulty),
    )
    .sort((a, b) => a.exercise_name.localeCompare(b.exercise_name));

  // A pick that a filter has since hidden no longer counts
  const selected = options.find((ex) => String(ex.id) === exerciseId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    onAdd(selected);
  }

  return (
    <ModalBase onClose={onClose} title="Add exercise" width="480px">
      <Form onSubmit={handleSubmit}>
        <Filters>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value={ANY}>Any</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {capitalize(cat.name)}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <FieldLabel>Difficulty</FieldLabel>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value={ANY}>Any</option>
              {exerciseDifficultyOptions.map((diff) => (
                <option key={diff} value={diff}>
                  {capitalize(diff)}
                </option>
              ))}
            </Select>
          </Field>
        </Filters>
        <Field>
          <FieldLabel>Exercise</FieldLabel>
          <Select
            value={selected ? exerciseId : ""}
            onChange={(e) => setExerciseId(e.target.value)}
            disabled={options.length === 0}
          >
            <option value="" disabled>
              {options.length === 0
                ? "No exercises match"
                : `Choose one of ${options.length}`}
            </option>
            {options.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {capitalize(ex.exercise_name)}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" $variant="primary" $block disabled={!selected}>
          <Plus size={18} aria-hidden="true" />
          Add to preset
        </Button>
      </Form>
    </ModalBase>
  );
}
