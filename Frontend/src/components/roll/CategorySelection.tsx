import styled from "styled-components";

interface Props {
  currentCount: number;
}

const CategorySelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  justify-self: center;
`;

const difficultyOptions = ["beginner", "advanced", "pro"] as const;
type difficulty = (typeof difficultyOptions)[number];

export function CategorySelection({ currentCount }: Props) {
  return (
    <CategorySelectionContainer>
      <span>Exercise {currentCount}:</span>
      <select name="category-select"></select>
      <select name="difficulty-select">
        {difficultyOptions.map((diff) => (
          <option value={diff}>
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </option>
        ))}
      </select>
    </CategorySelectionContainer>
  );
}
