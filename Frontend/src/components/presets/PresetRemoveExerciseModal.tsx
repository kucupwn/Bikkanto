import styled from "styled-components";
import { Trash2 } from "lucide-react";
import { ModalBase } from "../ModalBase";
import { Button, ButtonRow } from "../ui";
import type { PresetExercise } from "../../types/presetTypes";

const Text = styled.p`
  color: var(--ink-2);

  strong {
    color: var(--ink);
  }
`;

interface Props {
  entry: PresetExercise;
  presetName: string;
  onClose: () => void;
  onRemove: (entryId: number) => void;
}

// Removal only changes the edit draft; it reaches the server on Save.
export function PresetRemoveExerciseModal({
  entry,
  presetName,
  onClose,
  onRemove,
}: Props) {
  return (
    <ModalBase onClose={onClose} title="Remove exercise" width="440px">
      <Text>
        Remove <strong>{entry.exercise_name}</strong> from{" "}
        <strong>{presetName}</strong>? It's gone for good once you save.
      </Text>
      <ButtonRow $align="end">
        <Button $variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button $variant="danger" onClick={() => onRemove(entry.id)}>
          <Trash2 size={18} aria-hidden="true" />
          Remove
        </Button>
      </ButtonRow>
    </ModalBase>
  );
}
