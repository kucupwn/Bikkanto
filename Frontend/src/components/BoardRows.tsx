import styled, { keyframes } from "styled-components";

/* Exercise rows on the dark board, shared by the workout summary and the
   preset list. */

const columns = ({ $withReroll }: { $withReroll: boolean }) =>
  $withReroll
    ? "3rem minmax(0, 1fr) 12.5rem 8.5rem 40px"
    : "3rem minmax(0, 1fr) 12.5rem 8.5rem";

export const Head = styled.div<{ $withReroll: boolean }>`
  display: grid;
  grid-template-columns: ${columns};
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  border-bottom: 1px solid var(--board-line);
  font-family: var(--font-board);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber);

  > :nth-child(4) {
    text-align: right;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const lampOn = keyframes`
  from { background-color: rgba(255, 176, 0, 0.16); }
  to { background-color: transparent; }
`;

/* A row that lands or changes lights up like a board row being updated. */
export const Row = styled.li<{ $withReroll: boolean }>`
  animation: ${lampOn} 1.1s var(--ease-out);
  display: grid;
  grid-template-columns: ${columns};
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--board-line);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 700px) {
    grid-template-columns: 2.25rem minmax(0, 1fr) auto;
    grid-template-areas:
      "no name reps"
      "no tier reroll";
    gap: 0.25rem 0.75rem;
    padding: 1rem;

    > :nth-child(1) { grid-area: no; align-self: start; }
    > :nth-child(2) { grid-area: name; }
    > :nth-child(3) { grid-area: tier; }
    > :nth-child(4) { grid-area: reps; }
    > :nth-child(5) { grid-area: reroll; justify-self: end; }
  }
`;

export const Rows = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const No = styled.span`
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  color: var(--board-ink-2);
  font-variant-numeric: tabular-nums;
`;

export const Name = styled.div`
  min-width: 0;
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.2;

  small {
    display: block;
    margin-top: 2px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: var(--track);
    color: var(--board-ink-2);
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

export const Tier = styled.span`
  font-family: var(--font-board);
  font-size: 15px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--board-ink-2);

  b {
    color: var(--board-ink);
    font-weight: 600;
  }
`;

export const Reps = styled.div`
  justify-self: end;
`;

/* − / count / + control for editing a row's reps. */
export const RepsStepper = styled.div`
  display: grid;
  grid-template-columns: 32px 3.5rem 32px;
  height: 48px;
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  background: var(--board-cell);
  overflow: hidden;

  &:focus-within {
    border-color: var(--amber);
  }

  button {
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    color: var(--board-ink-2);

    &:hover:not(:disabled) {
      color: var(--amber);
    }

    &:disabled {
      opacity: 0.35;
    }
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    border-inline: 1px solid var(--board-line);
    background: transparent;
    color: var(--amber);
    font-family: var(--font-board);
    font-size: 26px;
    font-weight: 700;
    text-align: center;
    font-variant-numeric: tabular-nums;
    appearance: textfield;
    -moz-appearance: textfield;

    &:focus {
      outline: none;
    }
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
