import { useState } from "react";
import styled from "styled-components";
import { capitalize } from "../../utils";
import { ModalBase } from "../ModalBase";
import { Button } from "../ui";

const Text = styled.p`
  color: var(--ink-2);

  b {
    color: var(--ink);
    font-weight: 600;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface Props {
  categoryName: string;
  exerciseName: string;
  hasOwnCategories: boolean;
  onAddCategory: () => Promise<void>;
  onChooseOwn: () => void;
  onClose: () => void;
}

/* Shown when a pool exercise's category isn't in the user's library yet. */
export function MissingCategoryModal({
  categoryName,
  exerciseName,
  hasOwnCategories,
  onAddCategory,
  onChooseOwn,
  onClose,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    setIsAdding(true);
    try {
      await onAddCategory();
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <ModalBase onClose={onClose} title="Missing category" width="440px">
      <Text>
        <b>{capitalize(exerciseName)}</b> belongs to the{" "}
        <b>{capitalize(categoryName)}</b> category, which you don't have yet.
      </Text>
      <Actions>
        <Button $variant="primary" $block onClick={handleAdd} disabled={isAdding}>
          Add {capitalize(categoryName)} category
        </Button>
        <Button
          $block
          onClick={onChooseOwn}
          disabled={!hasOwnCategories || isAdding}
          title={hasOwnCategories ? undefined : "You have no categories yet"}
        >
          Choose one of my categories
        </Button>
        <Button $variant="ghost" $block onClick={onClose} disabled={isAdding}>
          Cancel
        </Button>
      </Actions>
    </ModalBase>
  );
}
