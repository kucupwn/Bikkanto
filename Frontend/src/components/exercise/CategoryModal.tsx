import { useState, type ChangeEvent, type FormEvent } from "react";
import styled from "styled-components";
import type { Category } from "../../types/exerciseTypes";
import { capitalize } from "../../utils";
import { api } from "../../api/api";
import { ModalBase } from "../ModalBase";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import {
  Button,
  Field,
  FieldLabel,
  Input,
  SegmentButton,
  Segmented,
  Select,
} from "../ui";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Warning = styled.p`
  color: var(--ink-2);
  font-size: 14px;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => Promise<void>;
}

type Operations = "add" | "delete";

export function CategoryModal(props: Props) {
  if (!props.isOpen) return null;
  return <CategoryModalContent {...props} />;
}

function CategoryModalContent({ onClose, categories, onSuccess }: Props) {
  const [operation, setOperation] = useState<Operations>("add");
  const [newCategory, setNewCategory] = useState<Category>({
    category_name: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    categories[0]?.id ?? 0,
  );
  const { showRibbon } = useRibbon();

  function handleCategoryNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNewCategory({ category_name: e.target.value.toLowerCase() });
  }

  function handleCategoryNameSelect(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCategoryId(Number(e.target.value));
  }

  async function handleAddCategory() {
    try {
      await api.post("/exercises/categories", newCategory);
      await onSuccess();
      showRibbon("success", "Category successfully added.");
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Category could not be added.";
      showRibbon("error", message);
    }
  }

  async function handleRemoveCategory() {
    try {
      await api.delete(`/exercises/categories/${selectedCategoryId}`);
      await onSuccess();
      showRibbon("success", "Category successfully deleted.");
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Category could not be deleted.";
      showRibbon("error", message);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (operation === "add") handleAddCategory();
    else handleRemoveCategory();
  }

  return (
    <ModalBase onClose={onClose} title="Categories">
      <Segmented role="tablist" aria-label="Category action">
        <SegmentButton
          role="tab"
          aria-selected={operation === "add"}
          $active={operation === "add"}
          onClick={() => setOperation("add")}
        >
          Add
        </SegmentButton>
        <SegmentButton
          role="tab"
          aria-selected={operation === "delete"}
          $active={operation === "delete"}
          onClick={() => setOperation("delete")}
          disabled={categories.length === 0}
        >
          Delete
        </SegmentButton>
      </Segmented>

      <Form onSubmit={handleSubmit}>
        {operation === "add" ? (
          <>
            <Field>
              <FieldLabel>Category name</FieldLabel>
              <Input
                type="text"
                name="category_name"
                placeholder="e.g. push up"
                value={newCategory.category_name}
                onChange={handleCategoryNameInput}
                autoFocus
                required
              />
            </Field>
            <Button
              type="submit"
              $variant="primary"
              $block
              disabled={!newCategory.category_name.trim()}
            >
              Add category
            </Button>
          </>
        ) : (
          <>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                name="id"
                value={selectedCategoryId}
                onChange={handleCategoryNameSelect}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {capitalize(cat.category_name)}
                  </option>
                ))}
              </Select>
            </Field>
            <Warning>
              Deleting a category cannot be undone.
            </Warning>
            <Button type="submit" $variant="danger" $block>
              Delete category
            </Button>
          </>
        )}
      </Form>
    </ModalBase>
  );
}
