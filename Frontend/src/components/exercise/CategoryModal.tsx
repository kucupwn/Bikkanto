import { useEffect, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import type { Category } from "../../types/exerciseTypes";
import { capitalize } from "../../utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 300px;
`;

const Button = styled.button`
  cursor: pointer;
  width: 100px;
  margin-top: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const OperationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

type Operations = "add" | "remove" | null;

export function CategoryModal({ isOpen, onClose, categories }: Props) {
  if (!isOpen) return null;

  const [operation, setOperation] = useState<Operations>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    categories[0]?.id ?? 0,
  );

  function handleCategoryNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNewCategoryName(e.target.value);
  }

  function handleCategoryNameSelect(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCategoryId(Number(e.target.value));
  }

  function handleAddCategory() {
    console.log(newCategoryName);
    onClose();
  }

  function handleRemoveCategory() {
    console.log(selectedCategoryId);
    onClose();
  }

  useEffect(() => {
    if (!isOpen) {
      setOperation(null);
      setNewCategoryName("");
    }
  }, [isOpen]);

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        {!operation && (
          <OperationsContainer>
            <Title>Choose category operation</Title>
            <ButtonWrapper>
              <Button onClick={() => setOperation("add")}>Add</Button>
              <Button onClick={() => setOperation("remove")}>Remove</Button>
            </ButtonWrapper>
          </OperationsContainer>
        )}
        {operation === "add" && (
          <OperationsContainer>
            <Title>Add new category name</Title>
            <input
              type="text"
              placeholder="Category name..."
              value={newCategoryName}
              onChange={handleCategoryNameInput}
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </OperationsContainer>
        )}
        {operation === "remove" && (
          <OperationsContainer>
            <Title>Select category to remove</Title>
            <select
              name="category-select"
              value={selectedCategoryId}
              onChange={handleCategoryNameSelect}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {capitalize(cat.category_name)}
                </option>
              ))}
            </select>
            <Button onClick={handleRemoveCategory}>Remove</Button>
          </OperationsContainer>
        )}
      </ModalBox>
    </Overlay>
  );
}
