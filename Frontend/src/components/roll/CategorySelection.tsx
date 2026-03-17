import styled from "styled-components";
import { difficultyOptions } from "../../types/exerciseTypes";

interface Props {
  currentCount: number;
}

const CategorySelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem;
  justify-self: center;
`;

export function CategorySelection({ currentCount }: Props) {
  return (
    <CategorySelectionContainer>
      <span>Exercise {currentCount}:</span>
      <select name="category-select"></select>
      <select name="difficulty-select">
        {difficultyOptions.map((diff) => (
          <option key={diff} value={diff}>
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </option>
        ))}
      </select>
    </CategorySelectionContainer>
  );
}
