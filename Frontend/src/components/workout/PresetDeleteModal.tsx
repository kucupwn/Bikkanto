import { useState } from "react";
import styled from "styled-components";
import { Trash2 } from "lucide-react";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { Button, ButtonRow } from "../ui";
import type { Preset } from "../../types/presetTypes";

const Text = styled.p`
  color: var(--ink-2);

  strong {
    color: var(--ink);
  }
`;

interface Props {
  preset: Preset;
  // Session id of an unlogged draft started from this preset, if one slipped
  // through; it is removed along with the preset so it can't dangle.
  draftSessionId: string | null;
  onClose: () => void;
  onDeleted: (presetId: number) => void;
}

export function PresetDeleteModal({
  preset,
  draftSessionId,
  onClose,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { showRibbon } = useRibbon();

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      if (draftSessionId) {
        await api.delete(`/history/draft/${draftSessionId}`);
      }
      await api.delete(`/presets/${preset.id}`);

      showRibbon("success", "Preset deleted.");
      onDeleted(preset.id);
    } catch {
      showRibbon("error", "Could not delete preset.");
      setIsDeleting(false);
    }
  }

  return (
    <ModalBase onClose={onClose} title="Delete preset" width="440px">
      <Text>
        Delete <strong>{preset.preset_name}</strong>? This can't be undone.
      </Text>
      <ButtonRow $align="end">
        <Button $variant="ghost" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button $variant="danger" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 size={18} aria-hidden="true" />
          Delete
        </Button>
      </ButtonRow>
    </ModalBase>
  );
}
