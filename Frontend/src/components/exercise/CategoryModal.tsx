import { useState } from "react";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

export function CategoryModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const [operation, setOperation] = useState<Operations>(null);

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
            <Title>New category name</Title>
            <input type="text" placeholder="Category name..." />
            <Button>Add</Button>
          </OperationsContainer>
        )}
      </ModalBox>
    </Overlay>
  );
}
