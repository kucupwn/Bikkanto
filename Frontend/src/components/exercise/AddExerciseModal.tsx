import styled from "styled-components";
import {
  exerciseDifficultyOptions,
  type Category,
  type Exercise,
} from "../../types/exerciseTypes";
import { capitalize } from "../../utils";

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const RepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExercisePropsContainer = styled.div`
  display: grid;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
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
        <input
          name="exercise-name"
          type="text"
          placeholder="Exercise name..."
        />
        <ExercisePropsContainer>
          <select name="category-select">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {capitalize(cat.category_name)}
              </option>
            ))}
          </select>
          <select name="exercise-difficulty-select">
            {exerciseDifficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {capitalize(diff)}
              </option>
            ))}
          </select>
          <RepsWrapper>
            <span>Easy min reps</span>
            <input name="easy-min" type="number" />
          </RepsWrapper>
          <RepsWrapper>
            <span>Easy max reps</span>
            <input name="easy-max" type="number" />
          </RepsWrapper>
          <RepsWrapper>
            <span>Medium min reps</span>
            <input name="medium-min" type="number" />
          </RepsWrapper>
          <RepsWrapper>
            <span>Medium max reps</span>
            <input name="medium-max" type="number" />
          </RepsWrapper>
          <RepsWrapper>
            <span>Hard min reps</span>
            <input name="hard-min" type="number" />
          </RepsWrapper>
          <RepsWrapper>
            <span>Hard max reps</span>
            <input name="hard-max" type="number" />
          </RepsWrapper>
        </ExercisePropsContainer>
      </ModalBox>
    </Overlay>
  );
}
