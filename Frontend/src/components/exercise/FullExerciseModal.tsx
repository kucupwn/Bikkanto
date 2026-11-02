import styled from "styled-components";
import { type Exercise, type Category } from "../../types/exerciseTypes";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { capitalize } from "../../utils";
import { ExercisePropsInput } from "./ExercisePropsInput";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { Button, Field, FieldLabel, Input, Select } from "../ui";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Note = styled.p`
  color: var(--ink-2);
  font-size: 14px;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  categories: Category[];
  mode: "add" | "edit" | "delete";
  onSuccess: () => Promise<void>;
}

const titleLabels = {
  add: "Add exercise",
  edit: "Edit exercise",
  delete: "Delete exercise",
};

const submitLabels = {
  add: "Add exercise",
  edit: "Save changes",
  delete: "Delete exercise",
};

export function FullExerciseModal(props: Props) {
  if (!props.isOpen) return null;
  return <FullExerciseModalContent {...props} />;
}

function FullExerciseModalContent({
  onClose,
  exercises,
  categories,
  mode,
  onSuccess,
}: Props) {
  const [exercise, setExercise] = useState<Exercise>(
    mode === "edit" || mode === "delete"
      ? exercises[0]
      : {
          exercise_name: "",
          difficulty: "beginner",
          easy_min: 1,
          easy_max: 1,
          medium_min: 1,
          medium_max: 1,
          hard_min: 1,
          hard_max: 1,
          category_id: categories[0]?.id ?? 0,
          category_name: categories[0]?.category_name ?? "",
        },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showRibbon } = useRibbon();

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === "exercise_id" && (mode === "edit" || mode === "delete")) {
      const selected = exercises.find((ex) => ex.id === Number(value));
      if (selected) {
        setExercise(selected);
      }
      return;
    }

    setExercise((prev) => {
      if (name === "exercise_name") {
        return {
          ...prev,
          exercise_name: value.toLowerCase(),
        };
      }

      if (name === "category_id") {
        const selected = categories.find((cat) => cat.id === Number(value));
        return {
          ...prev,
          category_id: Number(value),
          category_name: selected?.category_name ?? "",
        };
      }

      return {
        ...prev,
        [name]: e.target.type === "number" ? Number(value) : value,
      };
    });
  }

  async function handleSubmitExercise(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "add") {
        const existing = exercises.find(
          (ex) => ex.exercise_name === exercise.exercise_name.toLowerCase(),
        );

        if (existing) {
          showRibbon("error", `${exercise.exercise_name} already exists.`);
          return;
        } else {
          await api.post("/exercises", exercise);
          showRibbon("success", "Exercise successfully added.");
        }
      } else if (mode === "edit") {
        await api.put(`/exercises/${exercise.id}`, exercise);
        showRibbon("success", "Exercise successfully edited.");
      } else if (mode === "delete") {
        await api.delete(`/exercises/${exercise.id}`);
        showRibbon("success", "Exercise successfully deleted.");
      }

      await onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Exercise operation failed.";
      showRibbon("error", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalBase
      onClose={onClose}
      title={titleLabels[mode]}
      width={mode === "delete" ? "440px" : "520px"}
    >
      <Form onSubmit={handleSubmitExercise}>
        {mode === "edit" || mode === "delete" ? (
          <Field>
            <FieldLabel>Exercise</FieldLabel>
            <Select
              name="exercise_id"
              value={exercise.id}
              onChange={handleChange}
            >
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {capitalize(ex.exercise_name)}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              name="exercise_name"
              type="text"
              placeholder="e.g. diamond push up"
              value={exercise.exercise_name}
              onChange={handleChange}
              required
            />
          </Field>
        )}

        {mode === "add" && (
          <Note>The name can't be changed after the exercise is created.</Note>
        )}

        {mode !== "delete" && (
          <ExercisePropsInput
            exercise={exercise}
            categories={categories}
            onHandleChange={handleChange}
          />
        )}

        {mode === "delete" && (
          <Note>
            Deleting {capitalize(exercise.exercise_name)} also removes it from
            every workout in your history. This can't be undone.
          </Note>
        )}

        <Button
          type="submit"
          $variant={mode === "delete" ? "danger" : "primary"}
          $block
          disabled={
            isSubmitting || (mode === "add" && !exercise.exercise_name.trim())
          }
        >
          {submitLabels[mode]}
        </Button>
      </Form>
    </ModalBase>
  );
}
