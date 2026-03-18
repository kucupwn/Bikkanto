import styled from "styled-components";
import { difficultyOptions, type Category } from "../../types/exerciseTypes";
import { capitalize } from "../../utils";

interface Props {
  currentCount: number;
  categories: Category[];
}

const CategorySelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem;
  justify-self: center;
`;

export function CategorySelection({ currentCount, categories }: Props) {
  return (
    <CategorySelectionContainer>
      <span>Exercise {currentCount}:</span>
      <select name="category-select">
        {categories.map((cat) => (
          <option key={cat.category_name} value={cat.category_name}>
            {cat.category_name}
          </option>
        ))}
      </select>
      <select name="difficulty-select">
        {difficultyOptions.map((diff) => (
          <option key={diff} value={diff}>
            {capitalize(diff)}
          </option>
        ))}
      </select>
    </CategorySelectionContainer>
  );
}
