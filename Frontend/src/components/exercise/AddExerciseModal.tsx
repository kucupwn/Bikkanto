import styled from "styled-components";
import type { Category, Exercise } from "../../types/exerciseTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
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

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const ExercisePropsContainer = styled.div`
  display: grid;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
`;

export function AddExerciseModal({
  isOpen,
  onClose,
  exercises,
  categories,
}: Props) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>Add exercise</Title>
        <input type="text" placeholder="Exercise name..." />
        <ExercisePropsContainer>
          <select name="category-select">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </ExercisePropsContainer>
      </ModalBox>
    </Overlay>
  );
}
