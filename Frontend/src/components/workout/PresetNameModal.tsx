import { useState, type FormEvent } from "react";
import styled from "styled-components";
import { Save } from "lucide-react";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { Button, Field, FieldLabel, Input } from "../ui";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import type { PresetCreate } from "../../types/presetTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutEntry[];
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function PresetNameModal(props: Props) {
  if (!props.isOpen) return null;
  return <PresetNameContent {...props} />;
}

function PresetNameContent({ onClose, workout }: Props) {
  const [presetName, setPresetName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showRibbon } = useRibbon();

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!presetName.trim() || isSaving) return;

    const preset: PresetCreate = {
      preset_name: presetName,
      exercises: workout.map((entry) => ({
        exercise_id: entry.exercise_id,
        reps_difficulty: entry.reps_difficulty,
        reps: entry.reps,
      })),
    };

    setIsSaving(true);
    try {
      await api.post("/presets", preset);

      showRibbon("success", "Preset saved.");
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      showRibbon(
        "error",
        typeof detail === "string" ? detail : "Could not save preset.",
      );
      setIsSaving(false);
    }
  }

  return (
    <ModalBase onClose={onClose} title="Name preset" width="400px">
      <Form onSubmit={handleSave}>
        <Field>
          <FieldLabel>Preset name</FieldLabel>
          <Input
            type="text"
            placeholder="e.g. Morning push"
            maxLength={60}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            required
          />
        </Field>
        <Button
          type="submit"
          $variant="primary"
          $block
          disabled={!presetName.trim() || isSaving}
        >
          <Save size={18} aria-hidden="true" />
          Save
        </Button>
      </Form>
    </ModalBase>
  );
}
